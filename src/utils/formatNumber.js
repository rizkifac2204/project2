export function rupiah(number) {
  if (isNaN(number)) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  })
    .format(number)
    .replace(/(\.|,)00$/g, "");
}
