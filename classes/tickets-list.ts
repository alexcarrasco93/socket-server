import { Ticket } from '../interfaces/ticket';

export class TicketsList {
  private ticketNumber = 0;
  private ticketsToAttend: Ticket[] = [];
  private attendingTickets: Ticket[] = [];

  constructor() {}

  public addTicketToAttend() {
    this.ticketNumber++;
    const ticketTemp: Ticket = { id: this.ticketNumber };
    this.ticketsToAttend.push(ticketTemp);
    return ticketTemp;
  }

  public addAttendingTicket(ticket: Ticket) {
    this.attendingTickets.push(ticket);
    return ticket;
  }

  public attendTicket(ticket: Ticket) {
    this.addAttendingTicket(ticket);
    this.deleteTicketToAttend(ticket.id);
    return ticket;
  }

  public getTicketsToAttend() {
    return this.ticketsToAttend;
  }

  public getAttendigTickets() {
    const lastNumbersDesktops = this.controlDuplicatedDesktops();
    this.attendingTickets = lastNumbersDesktops;
    return this.attendingTickets;
  }

  public getTicketToAttend(id: number) {
    return this.ticketsToAttend.find((ticket) => ticket.id === id);
  }

  public getAttendedTicket(id: number) {
    return this.attendingTickets.find((ticket) => ticket.id === id);
  }

  public deleteTicketToAttend(id: number) {
    const ticketTemp = this.getTicketToAttend(id);

    this.ticketsToAttend = this.ticketsToAttend.filter(
      (ticket) => ticket.id !== id
    );

    return ticketTemp;
  }

  public deleteAttendedTicket(id: number) {
    const ticketTemp = this.getAttendedTicket(id);

    this.attendingTickets = this.attendingTickets.filter(
      (ticket) => ticket.id !== id
    );

    return ticketTemp;
  }

  private controlDuplicatedDesktops() {
    const lastNumbersDesktops: Ticket[] = [];
    this.attendingTickets.forEach((ticket) => {
      let i: number;
      const foundMatchingDesktop = lastNumbersDesktops.find((tick, index) => {
        if (tick.desktop === ticket.desktop) {
          i = index;
          return true;
        }
        return false;
      });
      if (foundMatchingDesktop) {
        if (foundMatchingDesktop.id < ticket.id) {
          lastNumbersDesktops.splice(i!, 1);
          lastNumbersDesktops.push(ticket);
        }
      } else {
        lastNumbersDesktops.push(ticket);
      }
    });
    return lastNumbersDesktops;
  }
}
