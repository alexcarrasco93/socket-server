"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketsList = void 0;
class TicketsList {
    constructor() {
        this.ticketNumber = 0;
        this.ticketsToAttend = [];
        this.attendingTickets = [];
    }
    addTicketToAttend() {
        this.ticketNumber++;
        const ticketTemp = { id: this.ticketNumber };
        this.ticketsToAttend.push(ticketTemp);
        return ticketTemp;
    }
    addAttendingTicket(ticket) {
        this.attendingTickets.push(ticket);
        return ticket;
    }
    attendTicket(ticket) {
        this.addAttendingTicket(ticket);
        this.deleteTicketToAttend(ticket.id);
        return ticket;
    }
    getTicketsToAttend() {
        return this.ticketsToAttend;
    }
    getAttendigTickets() {
        const lastNumbersDesktops = this.controlDuplicatedDesktops();
        this.attendingTickets = lastNumbersDesktops;
        return this.attendingTickets;
    }
    getTicketToAttend(id) {
        return this.ticketsToAttend.find((ticket) => ticket.id === id);
    }
    getAttendedTicket(id) {
        return this.attendingTickets.find((ticket) => ticket.id === id);
    }
    deleteTicketToAttend(id) {
        const ticketTemp = this.getTicketToAttend(id);
        this.ticketsToAttend = this.ticketsToAttend.filter((ticket) => ticket.id !== id);
        return ticketTemp;
    }
    deleteAttendedTicket(id) {
        const ticketTemp = this.getAttendedTicket(id);
        this.attendingTickets = this.attendingTickets.filter((ticket) => ticket.id !== id);
        return ticketTemp;
    }
    controlDuplicatedDesktops() {
        const lastNumbersDesktops = [];
        this.attendingTickets.forEach((ticket) => {
            let i;
            const foundMatchingDesktop = lastNumbersDesktops.find((tick, index) => {
                if (tick.desktop === ticket.desktop) {
                    i = index;
                    return true;
                }
                return false;
            });
            if (foundMatchingDesktop) {
                if (foundMatchingDesktop.id < ticket.id) {
                    lastNumbersDesktops.splice(i, 1);
                    lastNumbersDesktops.push(ticket);
                }
            }
            else {
                lastNumbersDesktops.push(ticket);
            }
        });
        return lastNumbersDesktops;
    }
}
exports.TicketsList = TicketsList;
