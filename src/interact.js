/**
 * @namespace MapInteraction
 */
/** 
 * @function
 * @instance
 * @name selectNode
 * @memberof MapInteraction
 * @description Select a node and add solid border to it.
 * @param {TargetElement} el - Target element return by E('...'), default value: currentTarget.
 */
export let selectNode = function(targetElement) {
  console.time('selectNode')
  if (typeof targetElement === 'string') {
    return this.selectNode(findEle(targetElement))
  }
  if (this.currentNode) this.currentNode.className = ''
  targetElement.className = 'selected'
  this.currentNode = targetElement
  this.bus.fire('selectNode', targetElement.nodeObj)
  console.timeEnd('selectNode')
}
export let unselectNode = function() {
  if (this.currentNode) {
    this.currentNode.className = ''
  }
  this.currentNode = null
  this.bus.fire('unselectNode')
}
export let selectNextSibling = function() {
  if (!this.currentNode || this.currentNode.dataset.nodeid === 'root') return

  let sibling = this.currentNode.parentElement.parentElement.nextSibling
  let target
  let grp = this.currentNode.parentElement.parentElement
  if (grp.className === 'right-side' || grp.className === 'left-side') {
    let siblingList = document.querySelectorAll('.' + grp.className)
    let i = Array.from(siblingList).indexOf(grp)
    if (i + 1 < siblingList.length) {
      target = siblingList[i + 1].firstChild.firstChild
    } else {
      return false
    }
  } else if (sibling) {
    target = sibling.firstChild.firstChild
  } else {
    return false
  }
  this.selectNode(target)
  target.scrollIntoViewIfNeeded()
  return true
}
export let selectPrevSibling = function() {
  if (!this.currentNode || this.currentNode.dataset.nodeid === 'root') return

  let sibling = this.currentNode.parentElement.parentElement.previousSibling
  let target
  let grp = this.currentNode.parentElement.parentElement
  if (grp.className === 'right-side' || grp.className === 'left-side') {
    let siblingList = document.querySelectorAll('.' + grp.className)
    let i = Array.from(siblingList).indexOf(grp)
    if (i - 1 >= 0) {
      target = siblingList[i - 1].firstChild.firstChild
    } else {
      return false
    }
  } else if (sibling) {
    target = sibling.firstChild.firstChild
  } else {
    return false
  }
  this.selectNode(target)
  target.scrollIntoViewIfNeeded()
  return true
}
export let selectFirstChild = function() {
  if (!this.currentNode) return
  let children = this.currentNode.parentElement.nextSibling
  if (children && children.firstChild) {
    let target = children.firstChild.firstChild.firstChild
    this.selectNode(target)
    target.scrollIntoViewIfNeeded()
  }
}
export let selectParent = function() {
  if (!this.currentNode || this.currentNode.dataset.nodeid === 'root') return
  let parent = this.currentNode.parentElement.parentElement.parentElement
    .previousSibling
  if (parent) {
    let target = parent.firstChild
    this.selectNode(target)
    target.scrollIntoViewIfNeeded()
  }
}
/**
 * @function
 * @instance
 * @name getAllDataString
 * @description Get all node data as string.
 * @memberof MapInteraction
 * @return {string}
 */
export let getAllDataString = function() {
  let data = {
    nodeData: this.nodeData,
    linkData: this.linkData,
  }
  return JSON.stringify(data, (k, v) => {
    if (k === 'parent') return undefined
    if (k === 'from') return v.nodeObj.id
    if (k === 'to') return v.nodeObj.id
    return v
  })
}
/**
 * @function
 * @instance
 * @name getAllData
 * @description Get all node data as object.
 * @memberof MapInteraction
 * @return {Object}
 */
export let getAllData = function() {
  let data = {
    nodeData: this.nodeData,
    linkData: this.linkData,
  }
  return JSON.parse(
    JSON.stringify(data, (k, v) => {
      if (k === 'parent') return undefined
      if (k === 'from') return v.nodeObj.id
      if (k === 'to') return v.nodeObj.id
      return v
    })
  )
}
/**
 * @function
 * @instance
 * @name scale
 * @description Change the scale of the mind map.
 * @memberof MapInteraction
 * @param {number}
 */
export let scale = function(scale) {
  this.scaleVal = scale
  this.map.style.transform = 'scale(' + scale + ')'
}
/**
 * @function
 * @instance
 * @name toCenter
 * @description Reset position of the map to center.
 * @memberof MapInteraction
 */
export let toCenter = function() {
  this.container.scrollTo(
    10000 - this.container.offsetWidth / 2,
    10000 - this.container.offsetHeight / 2
  )
}
export let install = function(plugin) {
  plugin(this)
}
/**
 * @function
 * @instance
 * @name focusNode
 * @description Enter focus mode, set the target element as root.
 * @memberof MapInteraction
 * @param {TargetElement} el - Target element return by E('...'), default value: currentTarget.
 */
export let focusNode = function(tpcEl) {
  if (tpcEl.nodeObj.root) return
  if (!this.tempDir) {
    this.tempDir = this.direction
  }
  this.nodeData = tpcEl.nodeObj
  this.nodeData.root = true
  this.initRight()
}
/**
 * @function
 * @instance
 * @name cancelFocus
 * @description Exit focus mode.
 * @memberof MapInteraction
 */
export let cancelFocus = function() {
  if (this.tempDir) {
    delete this.nodeData.root
    this.nodeData = this.nodeDataBackup
    this.direction = this.tempDir
    this.tempDir = null
    this.init()
  }
}
/**
 * @function
 * @instance
 * @name initLeft
 * @description Child nodes will distribute on the left side of the root node.
 * @memberof MapInteraction
 */
export let initLeft = function() {
  this.direction = 0
  this.init()
}
/**
 * @function
 * @instance
 * @name initRight
 * @description Child nodes will distribute on the right side of the root node.
 * @memberof MapInteraction
 */
export let initRight = function() {
  this.direction = 1
  this.init()
}
/**
 * @function
 * @instance
 * @name initSide
 * @description Child nodes will distribute on both left and right side of the root node.
 * @memberof MapInteraction
 */
export let initSide = function() {
  this.direction = 2
  this.init()
}
