class videoScroll {
    constructor(playback = 500, velocity = 0) {
        this.videos = []

        this.PLAYBACK = playback
        this.SCROLL_EASE = 0.05
        this.VELOCITY = velocity

        this.scrollRequest = 0
        this.requestId = null
    }

    addVideo(url, locationId = null, className = '', playback = null, velocity = null) {
        const newVideo = document.createElement('div')
        newVideo.classList.add('video')
        if (className !== '') newVideo.classList.add(className)
        newVideo.innerHTML = `
            <video style="position: fixed; top: 0; left: 0;" preload="auto" plays-inline="" muted="muted">
                <source src="${url}" type="video/mp4">
            </video>
        `
        newVideo.style.cssText = `
            position: static;
            top: 0;
        `

        const videoContainer = document.createElement('div')
        videoContainer.classList.add('video-container')
        videoContainer.append(newVideo)
        videoContainer.style.cssText = `
            position: relative;
        `

        this.videos.push({
            html: videoContainer,
            video: videoContainer.querySelector('video'),
            loaded: false,
            visible: false,
            locationId,
            offsetTop: null,
            offsetBottom: null,
            videoDuration: null,
            scrollY: 0,
            scrollerY: 0,
            times: [],
            pos: [],
            playback: playback || this.PLAYBACK,
            velocity: velocity || this.VELOCITY
        })
    }

    init() {
        this.videos.forEach(video => {
            const videoLocation = document.querySelector('#' + video.locationId) || document.querySelector('body')

            videoLocation.append(video.html)
            video.video.load()

            video.video.addEventListener('canplaythrough', function () {
                video.loaded = true
            }, {once: true})
            
            video.video.addEventListener('loadedmetadata', function (e) {
                video.videoDuration = video.video.duration
                video.html.style = `height: ${video.video.duration * (video.playback + video.velocity)}px`
                video.html.querySelector('.video').style.height = `${video.video.getBoundingClientRect().height}px`
                video.offsetTop = video.html.getBoundingClientRect().top + window.pageYOffset
                video.offsetBottom = video.html.getBoundingClientRect().bottom + window.pageYOffset
            }.bind(this), {once: true})
        })
    }

    render() {
        window.addEventListener("scroll", function() {
            this.scrollRequest++
            if (!this.requestId) {
                this.requestId = requestAnimationFrame(this.scrolling.bind(this))
            }
        }.bind(this));
    }

    scrolling() {
        this.videos.forEach(function(video) {
            video.offsetTop = video.html.getBoundingClientRect().top + window.pageYOffset
            video.offsetBottom = video.html.getBoundingClientRect().bottom + window.pageYOffset

            video.visible = (window.pageYOffset <= video.offsetBottom && window.pageYOffset + window.outerHeight >= video.offsetTop)

            if (video.visible) {
                video.scrollY = (window.pageYOffset - video.offsetTop) / video.playback
                video.scrollerY += (video.scrollY - video.scrollerY) * this.SCROLL_EASE

                if (Math.abs(video.scrollY - video.scrollerY) < this.SCROLL_EASE) {
                    video.scrollerY = video.scrollY
                    this.scrollRequest = 0
                    this.pos = []
                    this.times = []
                  }

                if (video.scrollerY < 0) video.scrollerY = 0
                if (video.video.currentTime !== video.scrollerY) video.video.currentTime = video.scrollerY;
            }
        }.bind(this))

        this.requestId = this.scrollRequest > 0 ? requestAnimationFrame(this.scrolling.bind(this)) : null;
    }

}
