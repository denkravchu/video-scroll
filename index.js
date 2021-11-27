window.onload = function () {
    const video = new videoScroll() // playback speed
    video.addVideo('./example.mp4', './example_revearse.mp4') // urlRorward - ссылка на видео, urlBackward - ссылка на это же видео но перевернутое, scrollHeight - как долго можно скроллить видео, locationID - id блока внутрь которого вставить видео, className - класс, который будет повешен на видео
    video.addVideo( './example.mp4', './example_revearse.mp4', 3000, 'videoHere')
    video.init()
    video.render()
}
