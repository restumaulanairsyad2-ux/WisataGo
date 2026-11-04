import { describe,expect,it } from "vitest";
import { calculateTotal } from "./pricing";

describe("calculateTotal",()=>{
  it("menghitung beberapa jenis tiket dengan kuantitas berbeda",()=>expect(calculateTotal([{unitPrice:50000,quantity:2},{unitPrice:25000,quantity:1}])).toBe(125000));
  it("mendukung tiket gratis",()=>expect(calculateTotal([{unitPrice:0,quantity:3}])).toBe(0));
  it("menolak jumlah nol",()=>expect(()=>calculateTotal([{unitPrice:10000,quantity:0}])).toThrow());
  it("menolak harga negatif",()=>expect(()=>calculateTotal([{unitPrice:-1,quantity:1}])).toThrow());
  it("membatasi kuantitas per kategori",()=>expect(()=>calculateTotal([{unitPrice:10000,quantity:11}])).toThrow());
});
