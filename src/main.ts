import './style.scss'
import { Plugin } from '@typora-community-plugin/core'


export default class extends Plugin {

  onload() {
    this.register(
      this.app.workspace.on('file:open', () => render().map(fold))
    )
    this.register(
      this.app.workspace.activeEditor.on('edit', render)
    )

    const write = document.getElementById('write')!
    this.registerDomEvent(write, 'click', unfold)
  }

  onunload() {
  }
}

function render() {
  return Array.from(document.querySelectorAll('blockquote > :first-child'))
    .map((p: HTMLElement) => {
      const blockquote = p.parentElement!
      const [, type, foldStatus] = p.textContent!.match(/^\[!(\w+)\]([+-]?)/) ?? []

      if (type) {
        blockquote.classList.add('typ-callout')
        blockquote.dataset.callout = p.dataset.callout = type.toLowerCase()
      }
      else {
        blockquote.classList.remove('typ-callout')
      }

      return [blockquote, foldStatus === '-']
    })
}

function fold([blockquote, isFolded]: [HTMLElement, boolean]) {
  if (!isFolded) return

  blockquote.classList.add('typ-callout--folded')
}

function unfold(event: MouseEvent) {
  (<HTMLElement>event.target)
    .closest('.typ-callout--folded')
    ?.classList.remove('typ-callout--folded')
}
