import { useState, useEffect } from "react"
import UserService from "../services/user.service";
import UrlEntry from "./UrlEntry";

const UserData = ({update}) => {
    const [urls, setUrls] = useState([])

    useEffect(() => {
        UserService.getUserUrls()
        .then((res) =>
            setUrls(res.data)
        )
        .catch(
            (error) => {
                console.log(error)
            }
        )
    }, [update]);

    if (urls) {
        return (
            <div className="panel panel-primary" id="result_panel">
                <div className="panel-body">
                    <ul className="list-group">
                    {urls.map((urlInfo) => {
                    return (
                        <UrlEntry key={urlInfo.Alias} alias={urlInfo.Alias} shortUrl={urlInfo.ShortUrl} url={urlInfo.Url}></UrlEntry>
                    )
                })}
                    </ul>
                </div>
            </div>
        );
    }
    else {
        return (
            <></>
        )
    }
}

export default UserData;
