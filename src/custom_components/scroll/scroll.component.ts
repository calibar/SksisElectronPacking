import { Component } from '@angular/core';

@Component({
    selector: 'scroll',
    template: require('./scroll.template.html'),
    styles: [require('./scroll.style.css').toString()],
})
export class ScrollComponent{

    isDown:boolean;

    ngOnInit(): void {
        this.isDown = false;
        window.addEventListener('scroll', () => { this.isDown = window.scrollY > 10; })
    }

    /**
     *
     * @param e - An Event object, used to prevent default action on clicking a tag
     * @param dir - Either 'up' or 'down' to determine scroll direction
     */
    scroll(e, dir) {
        e.preventDefault();
        let y = 0;
        if (dir === 'down') {
            y = 555;
        }
        window.scrollTo(0, y);
        this.isDown = !this.isDown;
    }
}