const UrlEntry = ({alias, shortUrl, url}) => {
    const urlLen = 45
    const shortUrlLen = 30

    if (shortUrl.length > shortUrlLen) {
        shortUrl = shortUrl.substring(0, shortUrlLen) + " . . ." 
    }
    if (url.length > urlLen) {
        url = url.substring(0, urlLen) + " . . ." 
    }
    const copyToClipboard = () => {
        navigator.clipboard.writeText(shortUrl)
    }

    return (
        <li className="list-group-item">
            <i className="fa fa-copy" onClick={copyToClipboard}></i>
            <span className="shorturl">{shortUrl}</span> <br/>
            <span className="url">{url}</span> 
        </li>
    );
}

export default UrlEntry;