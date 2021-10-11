import React from 'react';
import './App.scss';
import {createApiClient, Ticket} from './api';

export type AppState = {
	tickets?: Ticket[],
	search: string,
	ticketsToDisplay?: Ticket[];
}

const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {

	state: AppState = {
		search: '',

	}

	searchDebounce: any = null;

	async componentDidMount() {
		this.setState({
			tickets: await api.getTickets(),
			ticketsToDisplay: await api.getTickets()
		});
	}
	hideFunction = (id:string)=> {
		this.setState((state)=>({
			ticketsToDisplay:state.ticketsToDisplay && state.ticketsToDisplay.filter((ticket)=>(ticket.id !== id))
		}))
	}
	restoreTickets=()=>{
		this.setState((state)=>({
			ticketsToDisplay: state.tickets
		}))
	}


	renderTickets = (tickets: Ticket[]) => {

		const filteredTickets = tickets
		.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(this.state.search.toLowerCase()));


		return  (<ul className='tickets'>
			{filteredTickets.map((ticket) => (
				<li key={ticket.id} className='ticket'>
				<h3 className='title'>{ticket.title}</h3>
				<h5> {ticket.content}</h5>
				<footer>
					<div className='meta-data'>By {ticket.userEmail} | { new Date(ticket.creationTime).toLocaleString()}</div>
					<div className={"label"}>
					{ticket.labels && ticket.labels.map((label)=>(
						 <button > {label}</button>
					))}
					</div>
					<button className={"HideButton"} onClick={()=>{this.hideFunction(ticket.id)}} > Hide </button>
				</footer>
			</li>))}
		</ul>);
	}

	onSearch = async (val: string, newPage?: number) => {
		
		clearTimeout(this.searchDebounce);

		this.searchDebounce = setTimeout(async () => {
			this.setState({
				search: val
			});
		}, 300);
	}

	render() {	
		const {tickets,ticketsToDisplay} = this.state;

		return (<main>
			<h1>Tickets List</h1>
			<header>
				<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)}/>
			</header>
			{
				tickets && ticketsToDisplay &&
					<div>
						<p> {tickets.length-ticketsToDisplay.length}</p>
						<button onClick={()=>{this.restoreTickets()}}>restore</button>
					</div>

			}

			{ticketsToDisplay ? <div className='results'>Showing {ticketsToDisplay.length} results</div> : null }
			{ticketsToDisplay ? this.renderTickets(ticketsToDisplay) : <h2>Loading..</h2>}
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