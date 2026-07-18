import { getTodayKey } from "./date";

export function createEmptySession() {
  return {
    date: getTodayKey(),
    attendees: {},
  };
}

export function attendeeFromPerson(personId) {
  return {
    present: false,
    expense: 0,
    cashPaid: 0,
    transferPaid: 0,
    personId,
  };
}

export function getBaseDue(expense, splitAmount) {
  return Math.max(splitAmount - expense, 0);
}

export function buildAttendees(people, sessionAttendees) {
  return people
    .map((person) => {
      const attendee = sessionAttendees[person.id] ?? attendeeFromPerson(person.id);
      return {
        ...person,
        ...attendee,
      };
    })
    .filter((person) => person.present);
}

export function sortPeopleByAttendance(people, sessionAttendees) {
  return [...people].sort((leftPerson, rightPerson) => {
    const leftAttendee = sessionAttendees[leftPerson.id] ?? attendeeFromPerson(leftPerson.id);
    const rightAttendee = sessionAttendees[rightPerson.id] ?? attendeeFromPerson(rightPerson.id);

    if (leftAttendee.present !== rightAttendee.present) {
      return leftAttendee.present ? -1 : 1;
    }

    return leftPerson.name.localeCompare(rightPerson.name, "es", {
      sensitivity: "base",
    });
  });
}

export function buildSummary(attendees) {
  const totalExpense = attendees.reduce((sum, attendee) => sum + attendee.expense, 0);
  const totalCash = attendees.reduce((sum, attendee) => sum + attendee.cashPaid, 0);
  const totalTransfer = attendees.reduce((sum, attendee) => sum + attendee.transferPaid, 0);
  const peopleCount = attendees.length;
  const splitAmount = peopleCount > 0 ? totalExpense / peopleCount : 0;

  const rows = attendees.map((attendee) => {
    const net = attendee.expense - splitAmount;
    const paid = attendee.cashPaid + attendee.transferPaid;
    const baseDue = getBaseDue(attendee.expense, splitAmount);
    const pending = baseDue - paid;
    const receive = Math.max(net, 0);
    const owe = Math.max(pending, 0);

    return {
      ...attendee,
      splitAmount,
      net,
      baseDue,
      paid,
      receive,
      owe,
    };
  });

  return {
    peopleCount,
    splitAmount,
    totalExpense,
    totalCash,
    totalTransfer,
    totalToReceive: rows.reduce((sum, row) => sum + row.receive, 0),
    totalPending: rows.reduce((sum, row) => sum + row.owe, 0),
    collected: totalCash + totalTransfer,
    rows,
  };
}
