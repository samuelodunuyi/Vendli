/* eslint-disable @typescript-eslint/no-explicit-any -- smoke test reads loosely-typed API responses */
import { mockBaseQuery } from "./index";

const state = { auth: { accessToken: null as string | null } };
const api = { getState: () => state } as never;
const call = (url: string, method = "GET", body?: unknown) => mockBaseQuery({ url, method, body }, api, {}) as Promise<{ data?: any; error?: any }>;
const expect = (label: string, cond: boolean, extra?: unknown) => { console.log(`${cond ? "PASS" : "FAIL"}  ${label}`, cond ? "" : JSON.stringify(extra)?.slice(0, 300)); if (!cond) process.exitCode = 1; };
const login = async (email: string) => { const r = await call("Auth/login", "POST", { email, password: "Demo@123" }); state.auth.accessToken = r.data?.accessToken ?? null; return r; };

(async () => {
  expect("anonymous request is rejected", (await call("/Store")).error?.status === 401);
  expect("wrong password rejected", (await call("Auth/login", "POST", { email: "pos@vendli.ng", password: "nope" })).error?.status === 401);

  // ---- Super admin
  const sa = await login("superadmin@vendli.ng");
  expect("super admin login role 0", sa.data?.role === 0 && sa.data.store === null, sa);
  expect("super admin sees 5 stores", (await call("/Store")).data?.stores.length === 5);
  const stats = await call("/Statistics?timeline=month");
  expect("statistics has revenue", stats.data?.totalSales > 0, stats);
  expect("today stats work", (await call("/Statistics?timeline=today")).data?.salesChart.labels.length > 0);
  const sales = await call("/Statistics/Sales?dateRangeTimeline=last30days");
  expect("sales stats", sales.data?.totalOrders > 0 && sales.data.inventoryValue > 0, sales);
  const users = await call("/UserManagement/get-users?page=1&itemsPerPage=50");
  expect("users list excludes customers", users.data?.users.every((u: any) => u.roleId !== 3) && users.data.tiles.customers === 64, users.data?.tiles);
  expect("no passwords leak", !JSON.stringify(users.data).includes("Demo@123"));
  const created = await call("/UserManagement/create-user", "POST", { email: "new.admin@vendli.ng", password: "Passw0rd!", firstName: "New", lastName: "Admin", roleId: 1, storeId: 3 });
  expect("super admin creates store admin", !!created.data, created);
  expect("customer analytics", (await call("/Customer/analytics?timeline=year")).data?.demographics.totalCustomers === 64);
  expect("behaviour analytics", (await call("/customer-behaviour-analytics?windowDays=90")).data?.stores.length === 5);
  expect("regional prefs", (await call("/regional-preferences-analytics")).data?.stores[0].categories.length > 0);
  expect("inventory products", (await call("/Inventory/inventory-products?itemsPerPage=500")).data?.items.length === 225);
  expect("transactions summary", (await call("/Inventory/transactions?itemsPerPage=10")).data?.summary.length === 4);
  const transfer = await call("/Inventory/transactions/", "POST", { transactionType: 3, productId: 10, storeId: 1, fromStore: 1, toStore: 2, quantity: 1, reason: "test" });
  expect("super admin transfer", !!transfer.data, transfer);

  // ---- Store admin
  const st = await login("storeadmin@vendli.ng");
  expect("store admin login", st.data?.role === 1 && st.data.store.storeId === 1, st);
  expect("store admin sees only own store", (await call("/Store")).data?.stores.map((s: any) => s.storeId).join() === "1");
  expect("store admin blocked from other store stats", (await call("/Statistics?storeId=2")).error?.status === 403);
  const own = await call("/Order?itemsPerPage=500");
  expect("store admin orders scoped", own.data?.orders.every((o: any) => o.storeId === 1), own.error);
  const staff = await call("/UserManagement/get-users?itemsPerPage=50");
  expect("store admin sees own staff only", staff.data?.users.every((u: any) => u.storeId === 1), staff);
  expect("store admin cannot create super admin", (await call("/UserManagement/create-user", "POST", { email: "x@y.ng", password: "Passw0rd!", firstName: "X", lastName: "Y", roleId: 0 })).error?.status === 403);
  const emp = await call("/UserManagement/create-user", "POST", { email: "till2@vendli.ng", password: "Passw0rd!", firstName: "Till", lastName: "Two", roleId: 2, storeId: 4 });
  expect("store admin creates employee (store forced to own)", !!emp.data, emp);
  const list = await call("/UserManagement/get-users?search=till2");
  expect("new employee pinned to store 1", list.data?.users[0]?.storeId === 1, list.data);
  expect("store admin cannot edit catalogue", (await call("/Product/1", "PUT", { basePrice: 1 })).error?.status === 403);
  expect("store admin cannot transfer", (await call("/Inventory/transactions/", "POST", { transactionType: 3, productId: 10, storeId: 1, fromStore: 1, toStore: 2, quantity: 1, reason: "x" })).error?.status === 403);

  // ---- POS user
  const pos = await login("pos@vendli.ng");
  expect("pos login", pos.data?.role === 2 && pos.data.store.storeId === 1, pos);
  expect("pos blocked from statistics", (await call("/Statistics")).error?.status === 403);
  expect("pos blocked from users", (await call("/UserManagement/get-users")).error?.status === 403);
  const products = await call("/Product?itemsPerPage=500");
  const p = products.data.products.find((x: any) => x.basestock > 2);
  const order = await call("/Order", "POST", { storeId: 1, customerId: null, paymentOption: 0, orderItems: [{ productId: p.productId, quantity: 2, unitPrice: 1, discountId: "loyalty-10" }] });
  expect("pos sale ignores client price, applies discount", order.data?.orderItems[0].priceAtOrder === p.basePrice * 0.9, order);
  const after = await call("/Product?itemsPerPage=500");
  expect("stock decremented", after.data.products.find((x: any) => x.productId === p.productId).basestock === p.basestock - 2);
  expect("pos cannot sell for another store", (await call("/Order", "POST", { storeId: 2, paymentOption: 0, orderItems: [{ productId: p.productId, quantity: 1 }] })).error?.status === 403);
  expect("overselling blocked", (await call("/Order", "POST", { storeId: 1, paymentOption: 0, orderItems: [{ productId: p.productId, quantity: 99999 }] })).error?.status === 409);
  expect("void needs admin approval", (await call(`/Order/${order.data.id}/reverse`, "POST", { type: "void", reason: "x", approverEmail: "pos@vendli.ng", approverPassword: "Demo@123" })).error?.status === 403);
  const voided = await call(`/Order/${order.data.id}/reverse`, "POST", { type: "void", reason: "customer changed mind", approverEmail: "storeadmin@vendli.ng", approverPassword: "Demo@123" });
  expect("void with store admin approval restores stock", voided.data?.status === 7, voided);

  // ---- Token tampering / expiry
  state.auth.accessToken = "mock." + btoa(JSON.stringify({ sub: 1, exp: Date.now() + 1e6 })).replace(/.$/, "x");
  expect("malformed token rejected", (await call("/Store")).error?.status === 401);
  state.auth.accessToken = "mock." + btoa(JSON.stringify({ sub: 1, exp: Date.now() - 1 }));
  expect("expired token rejected", (await call("/Store")).error?.status === 401);
})();
