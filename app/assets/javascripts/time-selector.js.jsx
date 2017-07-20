class TimeSelector extends React.Component {
    constructor(props) {
        super(props);

        this.state = { unique: Cashular.Utils.makeid() };
        this.state.type = this.props.initial || {title: "Previous Week",
                                                 key: "previous_week",
                                                 daysAgo: 7};
    }

    previousTimePeriods() {
        return [{title: "Previous Week", key: "previous_week", daysAgo: 7},
                {title: "Previous Month", key: "previous_month", daysAgo: 30},
                {title: "Previous Year", key: "previous_year", daysAgo: 365},
                {title: "All Time", key: "all_time"}];
    }

    weeks() {
        var OneWeekAgo = Cashular.Utils.weeksAgo(1);
        var TwoWeeksAgo = Cashular.Utils.weeksAgo(2);
        var ThreeWeeksAgo = Cashular.Utils.weeksAgo(3);
        var FourWeeksAgo = Cashular.Utils.weeksAgo(4);

        return [{title: "One Week Ago", key: "one_week_ago", from: OneWeekAgo.from, to: OneWeekAgo.to},
                {title: "Two Weeks Ago", key: "two_week_ago", from: TwoWeeksAgo.from, to: TwoWeeksAgo.to},
                {title: "Three Weeks Ago", key: "three_week_ago", from: ThreeWeeksAgo.from, to: ThreeWeeksAgo.to},
                {title: "Four Weeks Ago", key: "four_week_ago", from: FourWeeksAgo.from, to: FourWeeksAgo.to}];
    }

    months() {
        var months = [ ];

        var year = new Date().getFullYear();

        for (var i = 1; i <= 12; i++) {
            var month = Cashular.Utils.monthsAgo(i);

            var title = month.title;
            if (month.year < year) {
                title += " " + year;
            }

            months.push({title: title,
                         key: month.title.replace(/ /, ""),
                         from: month.from,
                         to: month.to});
        }

        return months;
    }

    years() {
        var years = [ ];

        for (var i = 0; i <= 3; i++) {
            var year = Cashular.Utils.yearsAgo(i);

            years.push({title: year.title,
                        key: year.title.replace(/ /, ""),
                        from: year.from,
                        to: year.to});
        }

        return years;
    }

    changeType(type) {
        var self = this;
        return function() {
            self.setState({type: type}, function() {
                self.props.onChange(type);
            });
        };
    }

    render() {
        var self = this;
        return (
            <Cell desktop={12}>
                <List>
                    {self.previousTimePeriods().map(function(type, index) {
                        return <ListItem key={self.state.unique + type.key}
                                         name={self.state.unique + type.key}
                                         listname={self.state.unique}
                                         onChange={self.changeType(type)}
                                         checked={self.state.type.key === type.key}
                                         title={type.title}
                                         icon="restore" />
                    })}
                </List>
                <hr />
                <List>
                    {self.weeks().map(function(type, index) {
                        return <ListItem key={self.state.unique + type.key}
                                         name={self.state.unique + type.key}
                                         listname={self.state.unique}
                                         onChange={self.changeType(type)}
                                         checked={self.state.type.key === type.key}
                                         title={type.title}
                                         icon="restore" />
                    })}
                </List>
                <hr />
                <List>
                    {self.months().map(function(type, index) {
                        return <ListItem key={self.state.unique + type.key}
                                         name={self.state.unique + type.key}
                                         listname={self.state.unique}
                                         onChange={self.changeType(type)}
                                         checked={self.state.type.key === type.key}
                                         title={type.title}
                                         icon="restore" />
                    })}
                </List>
                <hr />
                <List>
                    {self.years().map(function(type, index) {
                        return <ListItem key={self.state.unique + type.key}
                                         name={self.state.unique + type.key}
                                         listname={self.state.unique}
                                         onChange={self.changeType(type)}
                                         checked={self.state.type.key === type.key}
                                         title={type.title}
                                         icon="restore" />
                    })}
                </List>
            </Cell>
        )
    }
}
