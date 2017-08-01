class Arranger extends React.Component {
    constructor(props) {
        super(props);

        this.onSwitchChange = this.onSwitchChange.bind(this);

        this.state = { unique: Cashular.Utils.makeid() };
    }

    onSwitchChange() {
        this.props.onSwitchChange($(this.deletedSwitchInput).is(':checked'));
    }

    componentDidMount() {
        componentHandler.upgradeElement(this.deletedSwitch);
    }

    render() {
        return (
            <Grid>
                <Cell desktop={3} tablet={1} phone={0}></Cell>
                <Cell desktop={5} tablet={6} phone={3} className="centered">
                    <H6>
                        {this.props.user.arrangerTransactions.length > 0 && this.props.showingNonDeleted &&
                            Cashular.Utils.prettyDate(new Date(this.props.user.arrangerTransactions[0].post_date))}
                        {this.props.user.arrangerTransactions.length > 0 && ! this.props.showingNonDeleted &&
                            "Deleted Transactions"}
                    </H6>
                </Cell>
                <Cell desktop={4} tablet={1} phone={1}>
                    <label className="mdl-switch mdl-js-switch mdl-js-ripple-effect transaction-switch"
                           htmlFor={this.state.unique+"-show-non-deleted"}
                           ref={(el) => { this.deletedSwitch = el}}>
                        <input type="checkbox"
                               id={this.state.unique+"-show-non-deleted"}
                               onChange={this.onSwitchChange}
                               className="mdl-switch__input"
                               defaultChecked={this.props.showingNonDeleted}
                               ref={(el) => { this.deletedSwitchInput = el}} />
                        <span className="mdl-switch__label"></span>
                    </label>
                </Cell>
                <Cell desktop={3} tablet={1} phone={0}></Cell>
                <Cell desktop={5} tablet={6} phone={4}>
                    <Transactions load={this.props.load}
                                  loadMore={this.props.loadMore}
                                  count={this.props.user.fullTransactionCount}
                                  transactions={this.props.user.arrangerTransactions}
                                  envelopes={this.props.user.envelopes} />
                </Cell>
                <Cell desktop={4} tablet={1} phone={0}></Cell>
            </Grid>
        );
    }
}
