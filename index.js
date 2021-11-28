window.onload = function () {
    const video = new videoScroll(500)
    video.addVideo('https://res.cloudinary.com/dd6pyhigu/video/upload/v1587924019/big_buck_bunny_jrvu13.mp4', 'https://res.cloudinary.com/dd6pyhigu/video/upload/v1587911709/big_buck_bunny-reverse_avl7u1.mp4') // urlRorward - ссылка на видео, urlBackward - ссылка на это же видео но перевернутое, scrollHeight - как долго можно скроллить видео, locationID - id блока внутрь которого вставить видео, className - класс, который будет повешен на видео
    video.addVideo( 'https://res.cloudinary.com/dd6pyhigu/video/upload/v1587924019/big_buck_bunny_jrvu13.mp4', 'https://res.cloudinary.com/dd6pyhigu/video/upload/v1587911709/big_buck_bunny-reverse_avl7u1.mp4', 10000, 'videoHere')
    video.init()
    video.render()
}
