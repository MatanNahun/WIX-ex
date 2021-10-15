import React, {useState} from 'react';
import './App.scss';
import {createApiClient, Ticket} from './api';
import ScrollUpButton from "./ScrollUp";
import TicketComponent from "./Ticket";

export type AppState = {
    tickets?: Ticket[],
    search: string,
    ticketsToDisplay?: Ticket[];
    page: number;
}

const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {

    state: AppState = {
        search: '', page:1

    }

    searchDebounce: any = null;

    async componentDidMount() {
        const {search, page} = this.state;
        this.setState({
            tickets: await api.getTickets(page, search),
        });
        this.setState({
            ticketsToDisplay: this.state.tickets
        });
    }

    hideFunction = (id: string) => {
        this.setState((state) => ({
            ticketsToDisplay: state.ticketsToDisplay && state.ticketsToDisplay.filter((ticket) => (ticket.id !== id))
        }))
    }
    // // readMore = ()=> {
    // // 	const [isTruncated, setIsTruncated] = useState(true)
    // // 	const resultString = isTruncated ? ticket.content.slice(0,100) : tickets.content;
    //
    //
    //
    //
    //
    //
    // }

    restoreTickets = () => {
        this.setState((state) => ({
            ticketsToDisplay: state.tickets
        }))
    }


    renderTickets = (tickets: Ticket[]) => {

        const filteredTickets = tickets
            .filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(this.state.search.toLowerCase()));

        return (<ul className='tickets'>
            {filteredTickets.map((ticket) =>
                <TicketComponent ticket={ticket} hide={this.hideFunction}/>
            )}
        </ul>);
    }

    onSearch = async (val: string, newPage?: number) => {
    console.log(val)

        clearTimeout(this.searchDebounce);

        this.searchDebounce = setTimeout(async () => {
            this.setState({
                search: val
            });
        }, 300);
        if (!val){
           return await this.onClear()
        }
        this.setState({
            tickets: await api.getTickets(this.state.page, this.state.search),
        });
        this.setState({
            ticketsToDisplay: this.state.tickets
        });
    }

    onClear = async () => {
        this.setState({
            tickets: await api.getTickets(1, ""),
        });
        this.setState({
            ticketsToDisplay: this.state.tickets
        });
    }

    render() {
        const {tickets, ticketsToDisplay} = this.state;
        const hiddenCount = (tickets || []).length - (ticketsToDisplay || []).length;



        return (<main>
            <h1>Tickets List</h1>
            <header>
                <input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)} />
            </header>
            <div className={"searchBar"}>
                {
                    tickets && ticketsToDisplay &&
                    <div className={"searchBar"}>
                        {tickets ? <div className='results'>Showing {tickets.length} results</div> : null}


                        {hiddenCount !== 0 &&

                        (<>
                            <p> ({hiddenCount} hidden {hiddenCount == 1 ? "ticket" : "tickets"} -</p>
                            <p className={"restoreButton"} onClick={() => {
                                this.restoreTickets()
                            }}>restore</p>
                            <p>)</p>
                        </>)}


                    </div>


                }


                {ticketsToDisplay ? this.renderTickets(ticketsToDisplay) : <h2>Loading..</h2>}
            </div>

            <ScrollUpButton/>


        </main>)
    }
}

// type Student={
// 	name:string,
// 	age:number
// }
// const s:Student={
// 	name:'sdgdsf',
// 	age:'sdg'
// }


export default App;