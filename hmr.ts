export type HMRType = "parcel" | "vite" | "webpack";
export const hmrCode: Record<HMRType, string> = {
  parcel: `
if (module.hot) {
  let update = (newText) => {
    sheet.replaceSync(newText);
    text = newText;
  };
  module.hot.accept(() => {
    update = module.hot.data.update ?? update;
    update(text);
  });
  module.hot.dispose((data) => {
    data.update = update;
  });
}
`,
  vite: `
if (import.meta.hot) {
  const update = (newText) => {
    sheet.replaceSync(newText);
    text = newText;
  };
  import.meta.hot.dispose((data) => {
    data.update ??= update;
  });
  import.meta.hot.accept((mod) => {
    import.meta.hot.data.update(mod.text)
  });
}
`,
  webpack: `
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  const update = import.meta.webpackHot.data?.update ?? ((newText) => {
    sheet.replaceSync(newText);
    text = newText;
  });
  update(text);
  import.meta.webpackHot.dispose((data) => {
    data.update = update;
  });
}
`,
};
