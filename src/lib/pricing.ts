export type PriceLine={unitPrice:number;quantity:number};
export function calculateTotal(lines:PriceLine[]):number{
  if(lines.length===0)throw new Error("Pilih setidaknya satu jenis tiket.");
  return lines.reduce((total,line)=>{
    if(!Number.isSafeInteger(line.unitPrice)||line.unitPrice<0)throw new Error("Harga tiket tidak valid.");
    if(!Number.isSafeInteger(line.quantity)||line.quantity<1||line.quantity>10)throw new Error("Jumlah tiket harus antara 1 dan 10.");
    return total+line.unitPrice*line.quantity;
  },0);
}
