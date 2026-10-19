//#region types
type ticketClassification = "RELEASE_BLOCKER" | "PRIORITY" | "UNASSIGNED" | "DONE" | "ACTIVE";
type ticketStatus = "open" | "testing" | "done";
type filterClassification =
	| "all"
	| "release_blocker"
	| "priority"
	| "unassigned"
	| "done"
	| "active";
type releaseDecision = "BLOCK" | "REVIEW" | "RELEASE";

type ticket = {
	id: number;
	title: string;
	severity: number;
	status: ticketStatus;
	owner: string | null;
	remainingHours: number;
	customerVip: boolean;
	blocked: boolean;
};
type conciseTicket = {
	id: number;
	title: string;
	owner: string | null;
	classification: ticketClassification;
};
type ticketsReport = {
	totalTickets: number;
	doneTickets: number;
	unassignedTickets: number;
	releaseBlockers: number;
	priorityTickets: number;
	activeTickets: number;
	totalRemainingHours: number;
	decision: releaseDecision;
};
//#endregion
//#region data
const tickets: ticket[] = [
	{
		id: 101,
		title: "Login outage",
		severity: 5,
		status: "open",
		owner: "Ava",
		remainingHours: 6,
		customerVip: true,
		blocked: false,
	},
	{
		id: 102,
		title: "Export slow",
		severity: 3,
		status: "open",
		owner: "Noah",
		remainingHours: 4,
		customerVip: false,
		blocked: false,
	},
	{
		id: 103,
		title: "Payment error",
		severity: 5,
		status: "testing",
		owner: "Ava",
		remainingHours: 9,
		customerVip: true,
		blocked: true,
	},
	{
		id: 104,
		title: "Avatar upload",
		severity: 2,
		status: "done",
		owner: "Mira",
		remainingHours: 3,
		customerVip: false,
		blocked: false,
	},
	{
		id: 105,
		title: "Search ranking",
		severity: 3,
		status: "open",
		owner: "Noah",
		remainingHours: 7,
		customerVip: true,
		blocked: false,
	},
	{
		id: 106,
		title: "Role permissions",
		severity: 4,
		status: "testing",
		owner: "Leo",
		remainingHours: 8,
		customerVip: false,
		blocked: false,
	},
	{
		id: 107,
		title: "Email delay",
		severity: 2,
		status: "open",
		owner: null,
		remainingHours: 2,
		customerVip: true,
		blocked: false,
	},
	{
		id: 108,
		title: "Backup failure",
		severity: 5,
		status: "open",
		owner: "Mira",
		remainingHours: 10,
		customerVip: false,
		blocked: true,
	},
	{
		id: 109,
		title: "Report totals",
		severity: 3,
		status: "done",
		owner: "Leo",
		remainingHours: 5,
		customerVip: false,
		blocked: false,
	},
	{
		id: 110,
		title: "Session timeout",
		severity: 4,
		status: "open",
		owner: "Ava",
		remainingHours: 6,
		customerVip: false,
		blocked: false,
	},
	{
		id: 111,
		title: "Mobile menu",
		severity: 1,
		status: "done",
		owner: "Noah",
		remainingHours: 2,
		customerVip: false,
		blocked: false,
	},
	{
		id: 112,
		title: "Invoice mismatch",
		severity: 4,
		status: "testing",
		owner: null,
		remainingHours: 7,
		customerVip: true,
		blocked: false,
	},
];
//#endregion
//#region get elements
function getRequiredElement<T extends HTMLElement>(id: string): T {
	const element = document.getElementById(id);

	if (!element) {
		throw new Error(`Required element "#${id}" was not found`);
	}

	return element as T;
}
const tableTickets = getRequiredElement<HTMLElement>("tickets-list");
const ulReleaseAnalysis = getRequiredElement<HTMLElement>("release-analysis-list");
const divReleaseDecision = getRequiredElement<HTMLElement>("release-decision");
const ulClassificationFilters = getRequiredElement<HTMLElement>("classification-filters");
const inputSearchBar = getRequiredElement<HTMLInputElement>("search-bar");
const pNoTicketsMessage = getRequiredElement<HTMLElement>("no-tickets-message");

const formNewTicket = getRequiredElement<HTMLFormElement>("new-ticket-form");
const inputNewTicketTitle = getRequiredElement<HTMLInputElement>("new-ticket-title");
const inputNewTicketSeverity = getRequiredElement<HTMLInputElement>("new-ticket-severity");
const inputNewTicketStatus = getRequiredElement<HTMLSelectElement>("new-ticket-status");
const inputNewTicketOwner = getRequiredElement<HTMLInputElement>("new-ticket-owner");
const inputNewTicketRemainingHours = getRequiredElement<HTMLInputElement>(
	"new-ticket-remaining-hours",
);
const inputNewTicketCustomerVip = getRequiredElement<HTMLInputElement>(
	"new-ticket-customer-vip",
);
const inputNewTicketBlocked = getRequiredElement<HTMLInputElement>("new-ticket-blocked");
//#endregion
//#region global variables
let ticketFilter: filterClassification = "all";
let ticketsSearch: string = "";
//#endregion
//#region event listeners
document.addEventListener("DOMContentLoaded", () => {
	displayTickets();
	displayReleaseAnalysis();
});

ulClassificationFilters.addEventListener("click", (event) => {
	if (!(event.target instanceof HTMLButtonElement)) return;
	if (!event.target.dataset.classification) return;

	ulClassificationFilters.querySelectorAll("button").forEach((button) => {
		button.classList.remove("selected");
	});
	event.target.classList.add("selected");

	ticketFilter = event.target.dataset.classification as filterClassification;
	filterTickets();
});

inputSearchBar.addEventListener("input", (event) => {
	if (!(event.target instanceof HTMLInputElement)) return;

	ticketsSearch = event.target.value.toLowerCase();
	filterTickets();
});

formNewTicket.addEventListener("submit", (event) => {
	event.preventDefault();

	const title: string = inputNewTicketTitle.value.trim();
	const severity: number = parseInt(inputNewTicketSeverity.value);
	const status: ticketStatus = inputNewTicketStatus.value as ticketStatus;
	const owner: string | null = inputNewTicketOwner.value.trim() || null;
	const remainingHours: number = parseInt(inputNewTicketRemainingHours.value);
	const customerVip: boolean = inputNewTicketCustomerVip.checked;
	const blocked: boolean = inputNewTicketBlocked.checked;
	const id: number = Math.max(...tickets.map((ticket) => ticket.id)) + 1;

	const newTicket: ticket = {
		id: id,
		title: title,
		severity: severity,
		status: status,
		owner: owner,
		remainingHours: remainingHours,
		customerVip: customerVip,
		blocked: blocked,
	};

	tickets.push(newTicket);
	filterTickets();
	displayReleaseAnalysis();
});
//#endregion
//#region functions
function filterTickets(ticketsList: ticket[] = tickets): void {
	const filteredTickets: ticket[] = ticketsList.filter((ticket) => {
		const title: string = ticket.title.toLowerCase();
		const classification: filterClassification = classifyTicket(
			ticket,
		).toLowerCase() as filterClassification;
		return (
			title.includes(ticketsSearch) &&
			(ticketFilter === "all" || classification === ticketFilter)
		);
	});

	if (filteredTickets.length === 0) {
		pNoTicketsMessage.classList.remove("hidden");
	} else {
		pNoTicketsMessage.classList.add("hidden");
	}

	tableTickets.innerHTML = "";
	displayTickets(filteredTickets);
}

function ticketsToDo(): ticket[] {
	const toDoTickets: ticket[] = [];

	tickets.forEach((ticket) => {
		if (ticket.blocked && ticket.severity >= 4) {
			toDoTickets.push(ticket);
		} else if (ticket.status === "open" && ticket.severity === 5) {
			toDoTickets.push(ticket);
		} else if (ticket.owner === null) {
			toDoTickets.push(ticket);
		}
	});

	return toDoTickets;
}

function totalHours(): number {
	return tickets.reduce((total, ticket) => total + ticket.remainingHours, 0);
}

function conciseTickets(): conciseTicket[] {
	const conciseTicketsList: conciseTicket[] = [];
	tickets.forEach((ticket) => {
		const classification: ticketClassification = classifyTicket(ticket);

		const conciseTicketItem: conciseTicket = {
			id: ticket.id,
			title: ticket.title,
			owner: ticket.owner,
			classification: classification,
		};
		conciseTicketsList.push(conciseTicketItem);
	});
	return conciseTicketsList;
}

function classifyTicket(ticket: ticket): ticketClassification {
	if (ticket.severity >= 4 && ticket.blocked) return "RELEASE_BLOCKER";
	if (ticket.severity === 5 && ticket.status === "open") return "RELEASE_BLOCKER";
	if (ticket.severity >= 3 && ticket.customerVip && ticket.status !== "done")
		return "PRIORITY";
	if (ticket.owner === null) return "UNASSIGNED";
	if (ticket.status === "done") return "DONE";
	return "ACTIVE";
}

function getTicketsReport(): ticketsReport {
	const conciseTicketsList: conciseTicket[] = conciseTickets();
	const doneTicketsCount: number = conciseTicketsList.filter(
		(ticket) => ticket.classification === "DONE",
	).length;
	const unassignedTicketsCount: number = conciseTicketsList.filter(
		(ticket) => ticket.classification === "UNASSIGNED",
	).length;
	const releaseBlockersCount: number = conciseTicketsList.filter(
		(ticket) => ticket.classification === "RELEASE_BLOCKER",
	).length;
	const priorityTicketsCount: number = conciseTicketsList.filter(
		(ticket) => ticket.classification === "PRIORITY",
	).length;
	const activeTicketsCount: number = conciseTicketsList.filter(
		(ticket) => ticket.classification === "ACTIVE",
	).length;

	const totalWorkHours: number = totalHours();

	let decision: releaseDecision;

	if (releaseBlockersCount > 0) {
		decision = "BLOCK";
	} else if (unassignedTicketsCount > 0) {
		decision = "REVIEW";
	} else if (totalWorkHours > 35) {
		decision = "REVIEW";
	} else {
		decision = "RELEASE";
	}

	return {
		totalTickets: conciseTicketsList.length,
		doneTickets: doneTicketsCount,
		unassignedTickets: unassignedTicketsCount,
		releaseBlockers: releaseBlockersCount,
		priorityTickets: priorityTicketsCount,
		activeTickets: activeTicketsCount,
		totalRemainingHours: totalWorkHours,
		decision: decision,
	};
}

function displayTickets(ticketsList: ticket[] = tickets): void {
	ticketsList.forEach((ticket) => {
		const tr: HTMLTableRowElement = document.createElement("tr");

		const tdId: HTMLTableCellElement = document.createElement("td");
		tdId.textContent = String(ticket.id);
		tr.appendChild(tdId);

		const tdTitle: HTMLTableCellElement = document.createElement("td");
		tdTitle.textContent = ticket.title;
		tr.appendChild(tdTitle);

		const tdSeverity: HTMLTableCellElement = document.createElement("td");
		tdSeverity.textContent = String(ticket.severity);
		tr.appendChild(tdSeverity);

		const tdStatus: HTMLTableCellElement = document.createElement("td");
		tdStatus.textContent = ticket.status;
		tr.appendChild(tdStatus);

		const tdOwner: HTMLTableCellElement = document.createElement("td");
		tdOwner.textContent = ticket.owner ? ticket.owner : "Unassigned";
		tr.appendChild(tdOwner);

		const tdRemainingHours: HTMLTableCellElement = document.createElement("td");
		tdRemainingHours.textContent = String(ticket.remainingHours);
		tr.appendChild(tdRemainingHours);

		const tdCustomerVip: HTMLTableCellElement = document.createElement("td");
		tdCustomerVip.textContent = ticket.customerVip ? "Yes" : "No";
		tr.appendChild(tdCustomerVip);

		const tdBlocked: HTMLTableCellElement = document.createElement("td");
		tdBlocked.textContent = ticket.blocked ? "Yes" : "No";
		tr.appendChild(tdBlocked);

		const tdClassification: HTMLTableCellElement = document.createElement("td");
		tdClassification.textContent = classifyTicket(ticket);
		tr.appendChild(tdClassification);

		tableTickets.appendChild(tr);
	});
}

function displayReleaseAnalysis(): void {
	const report: ticketsReport = getTicketsReport();

	const decision: releaseDecision = report.decision;

	ulReleaseAnalysis.innerHTML = "";

	const liTotalTickets: HTMLLIElement = document.createElement("li");
	liTotalTickets.textContent = `Total Tickets: ${report.totalTickets}`;
	ulReleaseAnalysis.appendChild(liTotalTickets);

	const liDoneTickets: HTMLLIElement = document.createElement("li");
	liDoneTickets.textContent = `Done Tickets: ${report.doneTickets}`;
	ulReleaseAnalysis.appendChild(liDoneTickets);

	const liUnassignedTickets: HTMLLIElement = document.createElement("li");
	liUnassignedTickets.textContent = `Unassigned Tickets: ${report.unassignedTickets}`;
	ulReleaseAnalysis.appendChild(liUnassignedTickets);

	const liReleaseBlockers: HTMLLIElement = document.createElement("li");
	liReleaseBlockers.textContent = `Release Blockers: ${report.releaseBlockers}`;
	ulReleaseAnalysis.appendChild(liReleaseBlockers);

	const liPriorityTickets: HTMLLIElement = document.createElement("li");
	liPriorityTickets.textContent = `Priority Tickets: ${report.priorityTickets}`;
	ulReleaseAnalysis.appendChild(liPriorityTickets);

	const liActiveTickets: HTMLLIElement = document.createElement("li");
	liActiveTickets.textContent = `Active Tickets: ${report.activeTickets}`;
	ulReleaseAnalysis.appendChild(liActiveTickets);

	const liTotalRemainingHours: HTMLLIElement = document.createElement("li");
	liTotalRemainingHours.textContent = `Total Remaining Hours: ${report.totalRemainingHours}`;
	ulReleaseAnalysis.appendChild(liTotalRemainingHours);

	divReleaseDecision.textContent = `Release Decision: ${decision}`;

	switch (decision) {
		case "BLOCK":
			divReleaseDecision.classList.add("error");
			break;
		case "RELEASE":
			divReleaseDecision.classList.add("success");
			break;
		default:
			divReleaseDecision.classList.add("warning");
	}
}
//#endregion
