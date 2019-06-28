const bcrypt = require('bcryptjs');


// Mongo Models
const User = require('../../models/user');
const Event = require('../../models/event');
const Booking = require('../../models/booking');


// Helpers
const { dateToString } = require('../../helpers/date');


const transformEvent = (event) => {
    return {
        ...event._doc,
        _id: event.id,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    }
}


const user = (userId) => {
    return User.findById(userId)
        .then((user) => {
            return { ...user._doc, _id: user.id, createdEvents: events.bind(this, user._doc.createdEvents) };
        }).catch((err) => {
            throw err;
        });
};

const events = (eventIds) => {
    return Event.find({ _id: { $in: eventIds } })
        .then((events) => {
            return events.map((event) => {
                return transformEvent(event);
            })
        }).catch((err) => {
            throw err;

        });
}

const singleEvent = (eventId) => {
    return Event.findById(eventId)
        .then((event) => {
            return transformEvent(event);
        })
        .catch((err) => {
            throw err;
        })
}


module.exports = {

    // Fetching all the events
    events: () => {
        return Event.find()
            .then((events) => {
                return events.map((event) => {
                    return transformEvent(event);
                })
            }).catch((err) => {
                throw err;
            })
    },


    // Creating any type of event
    createEvent: (args) => {
        const { title, description, price, date } = args.eventInput;
        // const event = {
        //     _id: Math.random().toString(),
        //     title: title,
        //     description: description,
        //     price: price,
        //     date: date
        // }
        const event = new Event({
            title: title,
            description: description,
            price: price,
            date: new Date(date),
            creator: '5d08a8cc89ecdd2b94be3cb2'
        })
        // events.push(event);
        let createdEvent;
        return event
            .save()
            .then((result) => {
                createdEvent = transformEvent(result);
                return User.findById('5d08a8cc89ecdd2b94be3cb2');
            })
            .then((user) => {
                if (!user) {
                    throw new Error('User not found!');
                }
                user.createdEvents.push(event)
                return user.save();
            })
            .then((result) => {
                return createdEvent;
            })
            .catch((err) => {
                throw err;
            });
    },
    createUser: (args) => {
        const { email, password } = args.userInput;

        return User.findOne({ email: email }).then((user) => {
            if (user) {
                throw new Error('User exists already.');
            }
            // Generating Hashed Password
            return bcrypt.hash(password, 12)
        }).then((hashedPassword) => {
            const user = new User({
                email: email,
                password: hashedPassword
            });
            return user.save();
            // The next then promise is a chain of the user.save() method
        }).then((result) => {
            return { ...result._doc, password: null, _id: result.id };
        }).catch((err) => {
            throw err;
        })
    },

    // Fetching all the bookings
    bookings: (args) => {
        return Booking.find()
            .then((bookings) => {
                return bookings.map((booking) => {
                    return {
                        ...booking._doc,
                        _id: booking.id,
                        user: user.bind(this, booking._doc.user),
                        event: singleEvent.bind(this, booking._doc.event),
                        createdAt: dateToString(booking._doc.createdAt),
                        updatedAt: dateToString(booking._doc.updatedAt)
                    }
                })
            })
            .catch((err) => {
                throw err;
            })
    },

    // Creating the booking by the user
    bookEvent: (args) => {
        const { eventId } = args;
        return Event.findOne({ _id: eventId })
            .then((fetchedEvent) => {
                return Booking({
                    user: '5d08a8cc89ecdd2b94be3cb2',
                    event: fetchedEvent
                })
            })
            .then((booking) => {
                return booking.save()
            })
            .then((result) => {
                return {
                    ...result._doc,
                    _id: result.id,
                    user: user.bind(this, result._doc.user),
                    event: singleEvent.bind(this, result._doc.event),
                    createdAt: dateToString(result._doc.createdAt),
                    updatedAt: dateToString(result._doc.updatedAt)
                }
            })
            .catch((err) => {
                throw err;
            })
    },
    cancelBooking: (args) => {
        const { bookingId } = args;

        return Booking.findById(bookingId)
            .populate('event')
            .then((fetchedBooking) => {
                return fetchedBooking.deleteOne({ _id: bookingId })
            })
            .then((result) => {
                return {
                    ...result._doc,
                    _id: result.id,
                    date: dateToString(result.event._doc.date),
                    creator: user.bind(this, result.event.creator)
                }
            })
            .catch((err) => {
                throw err;
            });
    }
}