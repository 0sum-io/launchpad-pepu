export async function selectImageFile() {
  return new Promise<{ name: string; file: File; data: string }>((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png, image/jpeg";
    input.onchange = () => {
      if (!input.files) {
        return;
      }
      const file = input.files[0];
      const reader = new FileReader();

      reader.onloadend = function () {
        if (reader.result) {
          resolve({ name: file.name, file, data: String(reader.result) });
        }
      };
      reader.readAsDataURL(file);
    };
    input.click();
  });
}
