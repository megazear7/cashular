class PeriodSelector extends React.Component {
    constructor(props) {
        super(props);

        this.state = { unique: Cashular.Utils.makeid() };
    }

    onChange(timePeriod) {
        var self = this;
        return function() {
            self.props.onChange(timePeriod);
        };
    }

    render() {
        return (
            <Grid>
                <Cell desktop={12}>
                    {typeof this.props.dateRange !== "undefined" && this.props.dateRange.weekly &&
                        <Radio name={this.state.unique+"-weekly"}
                               listname={this.state.unique+"aggregate-options"}
                               value="weekly"
                               onChange={this.onChange("weekly")}
                               title="Weekly" />}
                </Cell>
                <Cell desktop={12}>
                    {typeof this.props.dateRange !== "undefined" && this.props.dateRange.monthly &&
                        <Radio name={this.state.unique+"-monthly"}
                               listname={this.state.unique+"aggregate-options"}
                               value="monthly"
                               onChange={this.onChange("monthly")}
                               title="Monthly" />}
                </Cell>
                <Cell desktop={12}>
                    {((typeof this.props.dateRange !== "undefined" && this.props.dateRange.weekly) ||
                      (typeof this.props.dateRange !== "undefined" && this.props.dateRange.monthly)) &&
                        <Radio name={this.state.unique+"-all"}
                               listname={this.state.unique+"aggregate-options"}
                               value="all"
                               onChange={this.onChange("all")}
                               title="All"
                               checked={true} />}
                </Cell>
            </Grid>
        );
    }
}
