export async function uploadImage(file: File) {
  // https://api.imgbb.com/
  const formData = new FormData();
  formData.append("image", file);
  const request = await fetch(
    `https://api.imgbb.com/1/upload?key=2ae89f0085a842e1ddb6261602cdc71e`,
    {
      method: "POST",
      body: formData,
    }
  );
  const { data } = await request.json();
  return data.display_url;
}
