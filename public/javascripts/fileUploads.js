FilePond.registerPlugin(FilePondPluginFileEncode, FilePondPluginImagePreview, FilePondPluginImageResize);
FilePond.parse(document.body);
FilePond.setOptions({
    stylePanelAspectRatio: 150 / 100,
    imageResizeTargetWidth: 100,
    imageResizeTargetHeight: 150
})