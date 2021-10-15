import React, {FunctionComponent, useEffect, useState} from "react";
import {Ticket} from "./api";

const TicketComponent:FunctionComponent<{ ticket: Ticket, hide: Function}> = ({ ticket, hide }) => {
    const [showMore, setShowMore] = useState(false);

    // const lines = ticket.content.split("\n");
    const chars = ticket.content.length
    // const linesCount = lines.length;
    const getContent = () => {
        if (chars <= 400) {
            return ticket.content;
        }
        if (showMore) {
            return ticket.content
        }
        return ticket.content.slice(0,400) + "...";
    }

    return (<li key={ticket.id} className='ticket'>
        <h3 className='title'>{ticket.title}</h3>
        <p className={"ticketContent"}>{getContent()}</p>
        {(chars > 400) && <p className={"seeButton"}  onClick={() => setShowMore(!showMore)}>{showMore ? "show less" : "show more"}</p>}
        {/*<p className={"readMore"} onClick={()=>{this.readMore(this)}} > show more </p>*/}
        <footer>
            <div className='meta-data'>By {ticket.userEmail} | { new Date(ticket.creationTime).toLocaleString()}</div>
            <div className={"label"}>
                {ticket.labels && ticket.labels.map((label)=>(
                    <button> {label}</button>
                ))}
            </div>
            <p className={"HideButton"} onClick={()=>{hide(ticket.id)}} > Hide </p>
        </footer>

    </li>)
}

export default TicketComponent;