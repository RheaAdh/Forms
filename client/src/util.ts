const autoAdjustHeight = (e: any) => {
    e.target.style.height = ""
    e.target.style.height = e.target.scrollHeight + "px"
}

export default autoAdjustHeight
