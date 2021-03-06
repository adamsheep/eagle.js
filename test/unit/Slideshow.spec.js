import Vue from 'vue'
import { mount } from 'vue-test-utils'
import Slideshow from '../fixtures/simpleSlideshow.vue'

let wrapper, vm

beforeEach(() => {
  wrapper = mount(Slideshow, {
    attachToDocument: true
  })
  vm = wrapper.vm
})

describe('Slideshow initilization', () => {
  it('has correct slides count', () => {
    expect(vm.slides.length).toBe(3)
  })

  it('has set current slide', () => {
    expect(vm.currentSlideIndex).toBe(1)    
  })

  it('has the correct active slide', () => {
    expect(vm.slides[0].active).toBeTruthy()
  })
})

describe('Slideshow pre/next', () => {
  it('Slideshow goes to next slide when current slide\'s step run out', done => {
    vm.nextStep()
    setTimeout(() => {
      expect(vm.slides[0].active).toBeFalsy()
      expect(vm.slides[1].active).toBeTruthy()
      done()
    }, 1000)
  })

  it('Slideshow goes to prev slide when current slide\'s step run out', done => {
    vm.currentSlideIndex = 2
    vm.previousStep()
    setTimeout(() => {
      expect(vm.slides[1].active).toBeFalsy()
      expect(vm.slides[0].active).toBeTruthy()
      done()
    }, 1000)
  })

  it('Slideshow sets correct step within current slide', done => {
    vm.currentSlideIndex = 3
    vm.nextStep()
    setTimeout(() => {
      expect(vm.slides[2].active).toBeTruthy()
      expect(vm.step).toBe(2)
      done()
    }, 1000)
  })
})

describe('Slideshow events', () => {
  it('left arrow would perform prev', () => {
    const spy = jest.spyOn(vm, 'previousStep')
    wrapper.trigger('keydown', {
      key: 'ArrowLeft'
    })
    expect(spy).toHaveBeenCalled()
    
    spy.mockReset()
    spy.mockRestore()
  })

  it('right arrow would perform next', () => {
    const spy = jest.spyOn(vm, 'nextStep')
    wrapper.trigger('keydown', {
      key: 'ArrowRight'
    })
    expect(spy).toHaveBeenCalled()
    
    spy.mockReset()
    spy.mockRestore()
  })

  it('wheel would perform next', done => {
    const spy = jest.spyOn(vm, 'nextStep')
    wrapper.trigger('wheel', {
      deltaY: 100
    })
    setTimeout(() => { 
      expect(spy).toHaveBeenCalled()
      spy.mockReset()
      spy.mockRestore()
      done()
    }, 1000)
  })

  it('wheel event is throttled', done => {
    const spy = jest.spyOn(vm, 'nextStep')
    wrapper.trigger('wheel', {
      deltaY: 100
    })
    wrapper.trigger('wheel', {
      deltaY: 100
    })
   
    setTimeout(() => { 
      expect(spy).toHaveBeenCalledTimes(1)
      spy.mockReset()
      spy.mockRestore()
      done()
    }, 1000)
  })
})