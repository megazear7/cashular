class CardTitle extends React.Component {
    render() {
        return (
            <div className="mdl-card__title mdl-card--expand">
                <h2 className="mdl-card__title-text">
                    {this.props.children}
                </h2>
            </div>
        );
    }
}

class CardText extends React.Component {
    render() {
        return (
            <div className="mdl-card__supporting-text">
                {this.props.children}
            </div>
        );
    }
}

class CardActions extends React.Component {
    render() {
        return (
            <div className="mdl-card__actions mdl-card--border">
                {this.props.children}
            </div>
        );
    }
}

class H1 extends React.Component {
    render() {
        return (
            <h1 className="mdl-typography--display-1">
                {this.props.children}
            </h1>
        );
    }
}

class H2 extends React.Component {
    render() {
        return (
            <h2 className="mdl-typography--display-2">
                {this.props.children}
            </h2>
        );
    }
}

class H3 extends React.Component {
    render() {
        return (
            <h3 className="mdl-typography--display-3">
                {this.props.children}
            </h3>
        );
    }
}

class H4 extends React.Component {
    render() {
        return (
            <h4 className="mdl-typography--display-4">
                {this.props.children}
            </h4>
        );
    }
}

class H5 extends React.Component {
    render() {
        return (
            <h5 className="mdl-typography--headline">
                {this.props.children}
            </h5>
        );
    }
}

class H6 extends React.Component {
    render() {
        return (
            <h6 className="mdl-typography--title">
                {this.props.children}
            </h6>
        );
    }
}

class Button extends React.Component {
    render() {
        return (
            <a onClick={this.props.action} className={"mdl-button mdl-button--colored " + (this.props.center ? "centered" : "")}>
                {this.props.children}
            </a>
        );
    }
}

class BackButton extends React.Component {
    render() {
        return (
            <button className="mdl-button mdl-js-button mdl-button--icon back">
                <i className="material-icons" onClick={this.props.action}>arrow_back</i>
            </button>
        );
    }
}

class Cell extends React.Component {
    cellClass() {
        var cellClasses = ["mdl-cell"];

        if (this.props.desktop === 0) {
            cellClasses.push("mdl-cell--hide-desktop");
        } else if (this.props.desktop > 0) {
            cellClasses.push("mdl-cell--"+this.props.desktop+"-col-desktop");
        }

        if (this.props.tablet === 0) {
            cellClasses.push("mdl-cell--hide-tablet");
        } else if (this.props.tablet > 0) {
            cellClasses.push("mdl-cell--"+this.props.tablet+"-col-tablet");
        }

        if (this.props.phone === 0) {
            cellClasses.push("mdl-cell--hide-phone");
        } else if (this.props.phone > 0) {
            cellClasses.push("mdl-cell--"+this.props.phone+"-col-phone");
        }

        return cellClasses.join(" ");
    }

    render() {
        return (
            <div className={this.cellClass() + " " + this.props.className}>
                {this.props.children}
            </div>
        );
    }
}

class Card extends React.Component {
    render() {
        var classes = this.props.className + " mdl-card full-card mdl-shadow--2dp";
        return (
            <div className={classes}>
                {this.props.children}
            </div>
        );
    }
}

class Grid extends React.Component {
    render() {
        const classes = this.props.className + " mdl-grid";

        return (
            <div className={classes}>
                {this.props.children}
            </div>
        );
    }
}

class IconLink extends React.Component {
    render() {
        return (
          <a className="mdl-navigation__link" href={this.props.href}>
            <i className="material-icons">{this.props.icon}</i>
             {this.props.title}
          </a>
        );
    }
}

class Link extends React.Component {
    constructor(props) {
        super(props);

        this.onClickEvent = this.onClickEvent.bind(this);
    }

    onClickEvent(e) {
        if (this.props.action) {
            e.preventDefault();
            this.props.action(this.props);
        }
    }

    render() {
        return (
            <span className={"mdl-layout__link" + (this.props.isCurrent ? " mdl-navigation__link--current" : "")}>
                <a className="mdl-navigation__link"
                   href={this.props.href}
                   onClick={this.onClickEvent}>
                    {this.props.children}
                </a>
            </span>
        );
    }
}

class Drawer extends React.Component {
    render() {
        var self = this;
        return (
            <div className="mdl-layout__drawer">
                <span className="mdl-layout__title">{this.props.title}</span>
                <nav className="mdl-navigation"></nav>
            </div>
        );
    }
}

class TabBar extends React.Component {
    render() {
        return (
            <div className="mdl-layout__tab-bar">
                {this.props.children}
            </div>
         );
    }
}

class Tab extends React.Component {
    render() {
        var classes = this.props.className + " mdl-layout__tab";

        return (
            <a href={this.props.href} className={classes}>{this.props.children}</a>
        );
    }
}

class Header extends React.Component {
    render() {
        return (
          <header className="mdl-layout__header">
            <div className="mdl-layout__header-row">
              <span className="mdl-layout__title">
                {this.props.title}
              </span>
            </div>
            {this.props.children}
          </header>
        )
    }
}

class TabPanel extends React.Component {
    render() {
        var classes = this.props.className + " mdl-layout__tab-panel";

        return (
            <section className={classes} id={this.props.id}>
                {this.props.children}
            </section>
        );
    }
}

class Content extends React.Component {
    render() {
        return(
            <main className="mdl-layout__content">
                {this.props.children}
            </main>
        );
    }
}

class Layout extends React.Component {
    render() {
        return (
            <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header mdl-color-text--grey-600 main-layout">
                {this.props.children}
            </div>
        )
    }
}
