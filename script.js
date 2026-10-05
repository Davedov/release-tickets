//#region data
const tickets = [
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
//#region functions
function ticketById(id) {
	if (typeof id !== "number") return null;

	const ticket = tickets.find((ticket) => ticket.id === id);

	if (!ticket) return null;

	return ticket;
}

function ticketsToDo() {
	const toDoTickets = [];

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

function totalHours() {
	return tickets.reduce((total, ticket) => total + ticket.hours, 0);
}

function conciseTickets() {
	const conciseTickets = [];
	tickets.forEach((ticket) => {
		let classification = "";

		if (ticket.severity >= 4 && ticket.blocked) {
			classification = "RELEASE_BLOCKER";
		} else if (ticket.severity === 5 && ticket.status === "open") {
			classification = "RELEASE_BLOCKER";
		} else if (ticket.severity >= 3 && ticket.customerVip && ticket.status !== "done") {
			classification = "PRIORITY";
		} else if (ticket.owner === null) {
			classification = "UNASSIGNED";
		} else if (ticket.status === "done") {
			classification = "DONE";
		} else {
			classification = "ACTIVE";
		}

		const conciseTicket = {
			id: ticket.id,
			title: ticket.title,
			owner: ticket.owner,
			classification: classification,
		};
		conciseTickets.push(conciseTicket);
	});
	return conciseTickets;
}

function ticketsReport() {
	const conciseTicketsList = conciseTickets();
	const doneTicketsCount = conciseTicketsList.filter(
		(ticket) => ticket.classification === "DONE",
	).length;
	const unassignedTicketsCount = conciseTicketsList.filter(
		(ticket) => ticket.classification === "UNASSIGNED",
	).length;
	const releaseBlockersCount = conciseTicketsList.filter(
		(ticket) => ticket.classification === "RELEASE_BLOCKER",
	).length;
	const priorityTicketsCount = conciseTicketsList.filter(
		(ticket) => ticket.classification === "PRIORITY",
	).length;
	const activeTicketsCount = conciseTicketsList.filter(
		(ticket) => ticket.classification === "ACTIVE",
	).length;

	const totalWorkHours = totalHours();

	let decision = "";

	if (releaseBlockersCount > 0) {
		decision = "BLOCK";
	} else if (unassignedTicketsCount > 0) {
		decision = "REVIEW";
	} else if (totalHours > 35) {
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
		totalHours: totalWorkHours,
		decision: decision,
	};
}
//#endregion
