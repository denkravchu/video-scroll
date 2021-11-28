window.onload = function () {
    // new videoScroll(playback, velocity) параметр velocity вообще можно не использовать, он нужен только для правки погрешностей при делении. А так playback отвечает за скорость
    // но если например вы выставили playback и получили нужную скорость, но видео не доходит до конца и обрывается, значит увеличивайте velocity, по умолчанию оно равно 0
    // playback и velocity при инициализации будут одинаковыми для всех видео, но их можно задать каждому конкретному видео
    const video = new videoScroll(200) //
    // video.addVideo('https://assets.sonos.com/im/default/images/products/roam/roam-exploded-view-black.mp4', null, 'my-special-video', 1000, 100) 
    // addVideo(url, locationId, className, playback, velocity) 
    // playback, velocity задает параметры для конкретного видео
    video.addVideo( 'https://res.cloudinary.com/dd6pyhigu/video/upload/v1587924019/big_buck_bunny_jrvu13.mp4', 'videoHere')
    video.init()
    video.render()
}
