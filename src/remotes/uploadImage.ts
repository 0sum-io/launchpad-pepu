export async function uploadImage(file: File) {
  // https://api.imgbb.com/
  const formData = new FormData();
  formData.append("image", file);
  const request = await fetch(
    `https://api.imgbb.com/1/upload?key=411f454fe6994c276ac5cb714518decf`,
    {
      method: "POST",
      body: formData,
    }
  );
  const { data } = await request.json();
  return data.display_url;
}
