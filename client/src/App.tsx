import React from 'react';
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
        search: '',
        page: 1
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
        clearTimeout(this.searchDebounce);

        this.searchDebounce = setTimeout(async () => {
            this.setState({
                search: val
            });
        }, 300);
        if (!val){
           return await  this.onClear()
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

    updatePageNumber = (pageNumber: number) => {
        this.setState({page: pageNumber});
    }

    onNextButtonClick = async () => {
        const pageNumber = this.state.page + 1
        this.updatePageNumber(pageNumber);

        this.setState({tickets: await api.getTickets(pageNumber, "")});
        this.setState({ticketsToDisplay: this.state.tickets});
    }

    onPreviousButtonClick = async () => {
        const pageNumber = this.state.page - 1
        this.updatePageNumber(pageNumber);

        this.setState({tickets: await api.getTickets(pageNumber, "")});
        this.setState({ticketsToDisplay: this.state.tickets});
    }

    renderNextPreviousButtons = () => {
        return (
            <div className={"buttons"}>
                {this.state.page !== 1 ? <button className={"button"} onClick={this.onPreviousButtonClick}>Previous</button> : null}
                <button className={"button"} onClick={this.onNextButtonClick}>Next</button>
            </div>
        )
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

            {this.renderNextPreviousButtons()}

        </main>)
    }
}

export default App;
