const UrlEntry = ({alias, shortUrl, url}) => {
  
    const copyToClipboard = () => {
        if (navigator.clipboard) navigator.clipboard.writeText(shortUrl)
        else alert("Do not have access to clipboard")
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