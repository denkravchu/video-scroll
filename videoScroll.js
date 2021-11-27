class videoScroll {
    constructor() {
        this.videos = []

        this.PLAYBACKRATE_MIN = 0.15
        this.PLAYBACKRATE_MAX = 15
        this.VELOCITY_COEF = 1000

        this.SCROLL_EASE = 0.05

        this.scrollRequest = 0
        this.requestId = null
    }

    addVideo(urlForward, urlBackward, scrollHeight = 3000, locationId = null, className = '') {
        const newVideo = document.createElement('div')
        newVideo.classList.add('video')
        if (className !== '') newVideo.classList.add(className)
        newVideo.innerHTML = `
            <video class="videoBackward" style="position: absolute; top: 0; left: 0;" preload="none" autoplay="" plays-inline="" muted="muted">
                <source src="${urlBackward}" type="video/mp4">
            </video>
            <video class="videoForward" style="position: absolute; top: 0; left: 0;" preload="none" autoplay="" plays-inline="" muted="muted">
                <source src="${urlForward}" type="video/mp4">
            </video>
        `
        newVideo.style.cssText = `
            position: sticky;
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
            videoArray: Array.from(videoContainer.querySelectorAll('video')),
            loaded: [false, false],
            visible: false,
            locationId,
            offsetTop: null,
            offsetBottom: null,
            videoDuration: null,
            scrollY: 0,
            scrollerY: 0,
            times: [],
            pos: [],
            velocity: 0,
            scrollHeight: scrollHeight
        })
    }

    init() {
        this.videos.forEach(video => {
            const videoLocation = document.querySelector('#' + video.locationId) || document.querySelector('body')

            videoLocation.append(video.html)
            video.videoArray.forEach(videoElement => videoElement.load())

            video.videoArray.forEach((videoElement, idx) => {
                videoElement.addEventListener('canplaythrough', function () {
                    video.loaded[idx] = true
                    videoElement.pause()
                    videoElement.currentTime = 0  
                }, {once: true})
            })
            
            video.videoArray[1].addEventListener('loadedmetadata', function (e) {
                video.videoDuration = video.videoArray[1].duration
                video.html.style = `height: ${video.scrollHeight}px`
                video.html.querySelector('.video').style.height = `${video.videoArray[1].getBoundingClientRect().height}px`
                video.offsetTop = video.html.getBoundingClientRect().top + window.pageYOffset
                video.offsetBottom = video.html.getBoundingClientRect().bottom + window.pageYOffset
            }.bind(this), {once: true})

            console.log(this.videos)
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
                video.scrollY = window.pageYOffset - video.offsetTop
                video.scrollerY += (video.scrollY - video.scrollerY) * this.SCROLL_EASE

                if (Math.abs(video.scrollY - video.scrollerY) < this.SCROLL_EASE) {
                    video.scrollerY = video.scrollY
                    this.scrollRequest = 0
                    this.pos = []
                    this.times = []
                  }

                const timenow = performance.now()
                const posnow = video.scrollerY
                if (video.times.length == 0) {
                    video.times[0] = timenow
                    video.pos[0] = posnow
                    video.velocity = 0
                } else if (video.times.length == 1) {
                    video.times[1] = timenow
                    video.pos[1] = posnow
                    video.velocity = ((video.pos[1] - video.pos[0]) / (video.times[1] - video.times[0])) * this.VELOCITY_COEF
                } else {
                    video.times = [video.times[1], timenow]
                    video.pos = [video.pos[1], posnow]
                    video.velocity = ((video.pos[1] - video.pos[0]) / (video.times[1] - video.times[0])) * this.VELOCITY_COEF
                }

                const videoRate = Math.round(video.velocity) / 250

                if (videoRate >= this.PLAYBACKRATE_MIN & videoRate <= this.PLAYBACKRATE_MAX) {
                    video.videoArray[1].play();
                    TweenLite.set(video.videoArray[1], { autoAlpha: 1 });
                    TweenLite.set(video.videoArray[0], { autoAlpha: 0 });
                    video.videoArray[1].playbackRate = Math.abs(videoRate);
                    video.videoArray[0].currentTime = video.videoDuration - video.videoArray[1].currentTime;
                } else if (videoRate <= -this.PLAYBACKRATE_MIN && videoRate >= -this.PLAYBACKRATE_MAX) {
                    video.videoArray[0].play();
                    TweenLite.set(video.videoArray[0], { autoAlpha: 1 });
                    TweenLite.set(video.videoArray[1], { autoAlpha: 0 });
                    video.videoArray[0].playbackRate = Math.abs(videoRate);
                    video.videoArray[1].currentTime = video.videoDuration - video.videoArray[0].currentTime;
                } else if (videoRate > 0 && videoRate < this.PLAYBACKRATE_MIN) {
                    video.videoArray[1].playbackRate = 0;
                    video.videoArray[0].playbackRate = 0;
                    video.videoArray[0].currentTime = video.videoDuration - video.videoArray[1].currentTime;
                } else if (videoRate > -this.PLAYBACKRATE_MIN && videoRate < 0) {
                    video.videoArray[1].playbackRate = 0;
                    video.videoArray[0].playbackRate = 0;
                    video.videoArray[1].currentTime = video.videoDuration - video.videoArray[0].currentTime;
                } else if (videoRate == 0) {
                    video.videoArray[1].playbackRate = 0;
                    video.videoArray[0].playbackRate = 0;
                }
            }
        }.bind(this))

        this.requestId = this.scrollRequest > 0 ? requestAnimationFrame(this.scrolling.bind(this)) : null;
    }

}
