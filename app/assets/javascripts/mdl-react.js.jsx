class Menu extends React.Component {
    render() {
        return (
            <ul className="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" htmlFor={this.props.htmlFor}>
                {this.props.children}
            </ul>
        );
    }
}

class MenuItem extends React.Component {
    render() {
        return (
            <a className="mdl-menu__item mdl-js-ripple-effect">{this.props.children}</a>
        );
    }
}

class FileUploader extends React.Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    onChange(evt) {
        var files = evt.target.files;
        var file = files[0];

        this.input.value = file.name;

        this.props.action(file);
    }

    render() {
        return (
            <div className="mdl-textfield mdl-js-textfield mdl-textfield--file">
                <input className="mdl-textfield__input" placeholder="File" type="text" readOnly ref={(el) => { this.input = el; }} />

                <div className="mdl-button mdl-button--primary mdl-button--icon mdl-button--file">
                    <i className="material-icons">attach_file</i>
                    <input type="file" id="files" name="files[]" multiple onChange={this.onChange} />
                </div>
            </div>
        )
    }
}

class Table extends React.Component {
    render() {
        var self = this;

        var className = "mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp";
        if (typeof self.props.className !== "undefined") {
            className += " " + self.props.className
        }

        return (
            <table className={className}>
              <thead>
                <tr>
                  {self.props.columns.map(function(column, index) {
                      return <th className={column.numeric ? "" : "mdl-data-table__cell--non-numeric"} key={index}>{column.title}</th>
                  })}
                </tr>
              </thead>
              <tbody>
                {self.props.rows.map(function(row, index) {
                    return (<tr key={index}>
                                {self.props.columns.map(function(column, index) {
                                    return <td className={column.numeric ? "" : "mdl-data-table__cell--non-numeric"} key={index}>{row[column.name]}</td>
                                })}
                            </tr>)
                })}
              </tbody>
            </table>
        );
    }
}

class List extends React.Component {
    render() {
        return (
            <ul className="mdl-list">
                {this.props.children}
            </ul>
        );
    }
}
              
class ListItem extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
    }

    componentDidMount() {
        componentHandler.upgradeElement(this.radio);
    }

    toggle(e) {
        $(this.radio).click();
    }

    render() {
        var className = "mdl-list__item";

        if (this.props.checked) {
            className += " selected";
        }

        return (
            <li className={className} onClick={this.toggle}>
               <span className="mdl-list__item-primary-content">
                   <i className="material-icons  mdl-list__item-icon">{this.props.icon}</i>
                   {this.props.title}
               </span>
               <span className="mdl-list__item-secondary-action">
                   <label className="mdl-radio mdl-js-radio mdl-js-ripple-effect"
                          htmlFor={"list-option-"+this.props.name}
                          ref={(el) => { this.radio = el; }}>
                       <input type="radio"
                              id={"list-option-"+this.props.name}
                              className="mdl-radio__button"
                              name={this.props.listname}
                              value={this.props.title}
                              onChange={this.props.onChange}
                              checked={this.props.checked} />
                   </label>
               </span>
            </li>
        );
    }
}

class Radio extends React.Component {
    componentDidMount() {
        componentHandler.upgradeElement(this.radio);
    }

    render() {
        return (
            <label className="mdl-radio mdl-js-radio mdl-js-ripple-effect"
                   htmlFor={this.props.name}
                   ref={(el) => { this.radio = el; }}>
                <input type="radio"
                       id={this.props.name}
                       className="mdl-radio__button"
                       name={this.props.listname}
                       value={this.props.value}
                       onChange={this.props.onChange}
                       defaultChecked={this.props.checked} />
                <span className="mdl-radio__label">{this.props.title}</span>
            </label>
        );
    }
}

class CardMenu extends React.Component {
    render() {
        return (
            <div className="mdl-card__menu">
                {this.props.children}
            </div>
        );
    }
}

class CardTitle extends React.Component {
    render() {
        var className = "mdl-card__title";
        if (! this.props.dontExpand) {
            className += " mdl-card--expand";
        }
        return (
            <div className={className}>
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
        var className = "mdl-card__actions mdl-card--border";

        if (typeof this.props.className !== "undefined") {
            className += " " + this.props.className;
        }

        return (
            <div className={className}>
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
        var className = "mdl-typography--title";
        if (this.props.className) {
            className += " " + this.props.className;
        }
        return (
            <h6 className={className}>
                {this.props.children}
            </h6>
        );
    }
}

class BasicIcon extends React.Component {
    render() {
        var className = "mdl-button mdl-button--icon";

        if (typeof this.props.className !== "undefined") {
            className += " " + this.props.className;
        }

        return (
            <button className={className} disabled>
                <i className="material-icons">{this.props.icon}</i>
            </button>
        );
    }
}

class Icon extends React.Component {
    render() {
        var className = "mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect";

        if (typeof this.props.className !== "undefined") {
            className += " " + this.props.className;
        }


        return (
            <button className={className} onClick={this.props.action}>
                <i className="material-icons">{this.props.icon}</i>
            </button>
        );
    }
}

class LesserIcon extends React.Component {
    render() {
        var className = "mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect";

        if (typeof this.props.className !== "undefined") {
            className += " " + this.props.className;
        }

        return (
            <button className={className} onClick={this.props.action}>
                <i className="material-icons lesser-icon">{this.props.icon}</i>
            </button>
        );
    }
}

class Button extends React.Component {
    render() {
        var className = "mdl-button mdl-button--colored " + (this.props.center ? "centered" : "");

        if (this.props.className) {
            className += " " + this.props.className
        }

        return (
            <a onClick={this.props.action} className={className}>
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

class TextField extends React.Component {
    constructor(props) {
        super(props);

        this.state = {text: ""};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        componentHandler.upgradeElement(this.textInput);
    }

    handleChange(e) {
        var self = this;

        self.setState({text: e.target.value}, function() {
            if (typeof self.props.onChange === "function") {
                self.props.onChange(this.state.text);
            }
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        if (typeof this.props.onSubmit === "function") {
            this.props.onSubmit(this.state.text);
            this.setState({text: ""});
        }
    }

    render() {
        return (
            <form action="#" onSubmit={this.handleSubmit}>
              <div className="mdl-textfield mdl-js-textfield mdl-textfield--expandable" ref={(el) => { this.textInput = el; }}>
                <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor={this.props.name}>
                  <i className="material-icons">add</i>
                </label>
                <div className="mdl-textfield__expandable-holder">
                  <input className="mdl-textfield__input" type="text" id={this.props.name}
                         name={this.props.name} placeholder={this.props.placeholder}
                         onChange={this.handleChange} value={this.state.text} />
                  <label className="mdl-textfield__label" htmlFor="sample-expandable"></label>
                </div>
              </div>
            </form>
        )
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
        var classes = " mdl-grid";

        if (this.props.className) {
            classes = classes + " " + this.props.className;
        }

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
                <nav className="mdl-navigation">
                    {this.props.children}
                    <a className="mdl-navigation__link" href="/users/sign_out" data-method="delete">Sign out</a>
                </nav>
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
              <div className="mdl-layout__header-row"></div>
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
            <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header mdl-color-text--grey-600 mdl-layout--fixed-tabs  mdl-layout--fixed-drawer mdl-layout--overlay-drawer-button">
                {this.props.children}
            </div>
        )
    }
}
