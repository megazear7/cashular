class Envelopes extends React.Component {
    constructor(props) {
        super(props);

        this.load = this.load.bind(this);

        this.state = { envelopes: [ ],
                       type: {title: "Previous Week", key: "previous_week", daysAgo: 7},
                       unique: Cashular.Utils.makeid() };

        this.load();
    }

    load() {
        var self = this;

        var envelopes = Cashular.Envelopes()
        var unallocated = Cashular.Transactions()
            
        if (typeof self.state.type.daysAgo !== "undefined") {
            envelopes.daysAgo(self.state.type.daysAgo);
            unallocated.daysAgo(self.state.type.daysAgo);
        } else if (typeof self.state.type.from !== "undefined") {
            envelopes.from(self.state.type.from).to(self.state.type.to);
            unallocated.from(self.state.type.from).to(self.state.type.to);
        }

        envelopes.all(function(envelopes) {
            self.setState({envelopes: envelopes}, function() {
                self.props.addOrRemoved(self.state.envelopes);
            });
        });

        unallocated.unallocated()
        .done(function(unallocated) {
            self.setState({unallocated: unallocated});
        });
    }

    typesA() {
        return [{title: "Previous Week", key: "previous_week", daysAgo: 7},
                {title: "Previous Month", key: "previous_month", daysAgo: 30},
                {title: "Previous Year", key: "previous_year", daysAgo: 365},
                {title: "All Time", key: "all_time"}];
    }

    typesB() {
        var OneWeekAgo = Cashular.Utils.weeksAgo(1);
        var TwoWeeksAgo = Cashular.Utils.weeksAgo(2);
        var ThreeWeeksAgo = Cashular.Utils.weeksAgo(3);
        var FourWeeksAgo = Cashular.Utils.weeksAgo(4);

        return [{title: "One Week Ago", key: "one_week_ago", from: OneWeekAgo.from, to: OneWeekAgo.to},
                {title: "Two Weeks Ago", key: "two_week_ago", from: TwoWeeksAgo.from, to: TwoWeeksAgo.to},
                {title: "Three Weeks Ago", key: "three_week_ago", from: ThreeWeeksAgo.from, to: ThreeWeeksAgo.to},
                {title: "Four Weeks Ago", key: "four_week_ago", from: FourWeeksAgo.from, to: FourWeeksAgo.to}];
    }

    typesC() {
        var OneMonthAgo = Cashular.Utils.monthsAgo(1);
        var TwoMonthsAgo = Cashular.Utils.monthsAgo(2);
        var ThreeMonthsAgo = Cashular.Utils.monthsAgo(3);
        var FourMonthsAgo = Cashular.Utils.monthsAgo(4);

        return [{title: "One Month Ago", key: "one_month_ago", from: OneMonthAgo.from, to: OneMonthAgo.to},
                {title: "Two Months Ago", key: "two_month_ago", from: TwoMonthsAgo.from, to: TwoMonthsAgo.to},
                {title: "Three Months Ago", key: "three_month_ago", from: ThreeMonthsAgo.from, to: ThreeMonthsAgo.to},
                {title: "Four Months Ago", key: "four_month_ago", from: FourMonthsAgo.from, to: FourMonthsAgo.to}];
    }

    changeType(type) {
        var self = this;
        return function() {
            self.setState({type: type}, function() {
                self.load();
            });
        };
    }

    render() {
        var self = this;
        return (
            <Grid>
                <Cell desktop={3}>
                    <List>
                        {self.typesA().map(function(type, index) {
                            return <ListItem key={type.key}
                                             name={type.key}
                                             listname={self.state.unique}
                                             onChange={self.changeType(type)}
                                             checked={self.state.type.key === type.key}
                                             title={type.title}
                                             icon="restore" />
                        })}
                    </List>
                    <hr />
                    <List>
                        {self.typesC().map(function(type, index) {
                            return <ListItem key={type.key}
                                             name={type.key}
                                             listname={self.state.unique}
                                             onChange={self.changeType(type)}
                                             checked={self.state.type.key === type.key}
                                             title={type.title}
                                             icon="restore" />
                        })}
                    </List>
                    <hr />
                    <List>
                        {self.typesB().map(function(type, index) {
                            return <ListItem key={type.key}
                                             name={type.key}
                                             listname={self.state.unique}
                                             onChange={self.changeType(type)}
                                             checked={self.state.type.key === type.key}
                                             title={type.title}
                                             icon="restore" />
                        })}
                    </List>
                </Cell>
                <Cell desktop={9}>
                    <Grid>
                        {self.state.envelopes.map(function(envelope, index) {
                            if (envelope.sum !== 0) {
                                return <Envelope amount={envelope.sum}
                                                 title={envelope.title}
                                                 key={index}
                                                 onRemove={self.load}
                                                 id={envelope.id} /> }})}
                        <NewEnvelope onCreate={self.load} />
                    </Grid>
                </Cell>
                <Cell desktop={3}>
                </Cell>
                <Cell desktop={9}>
                    <hr />
                </Cell>
                <Cell desktop={3}>
                </Cell>
                <Cell desktop={6}>
                    <H6>Empty Envelopes</H6>
                    <Grid>
                        {self.state.envelopes.map(function(envelope, index) {
                            if (envelope.sum === 0) {
                                return <Envelope amount={envelope.sum}
                                                 title={envelope.title}
                                                 dontShowAmount={true}
                                                 key={index}
                                                 onRemove={self.load}
                                                 id={envelope.id}
                                                 size={4} /> }})}
                    </Grid>
                </Cell>
                <Cell desktop={3}>
                    {typeof self.state.unallocated !== "undefined" && (self.state.unallocated.payments > 0 || self.state.unallocated.recieved > 0) &&
                        <Grid>
                            <Cell desktop={12}>
                                <H6>Unallocated</H6>
                                {self.state.unallocated.payments > 0 &&
                                    <p>Payments: ${self.state.unallocated.payments.toFixed(2)}</p>}
                                {self.state.unallocated.recieved > 0 &&
                                    <p>Recieved: ${self.state.unallocated.recieved.toFixed(2)}</p>}
                            </Cell>
                        </Grid>}
                </Cell>
            </Grid>
        );
    }
}
