import MuiLink from '@mui/material/Link';
import {Link} from "react-router-dom";
import {page} from "@src/reactbootdev/decorator/Page";


function WelcomeComponent() {
    return (
        <div>
            <div>
                <Link to="/c">
                    {'create'}
                </Link>
            </div>
            <div>
                <Link to="/r">
                    {'read list'}
                </Link>
            </div>
            <div>
                <Link to="/rd">
                    {'read detail'}
                </Link>
            </div>
            <div>
                <Link to="/u">
                    {'update'}
                </Link>
            </div>
            <div>
                <Link to="/d">
                    {'delete'}
                </Link>
            </div>
            <hr/>
            <div>
                <MuiLink href="c" underline="hover">
                    {'create'}
                </MuiLink>
            </div>
            <div>
                <MuiLink href="r" underline="hover">
                    {'read list'}
                </MuiLink>
            </div>
            <div>
                <MuiLink href="rd" underline="hover">
                    {'read detail'}
                </MuiLink>
            </div>
            <div>
                <MuiLink href="u" underline="hover">
                    {'update'}
                </MuiLink>
            </div>
            <div>
                <MuiLink href="d" underline="hover">
                    {'delete'}
                </MuiLink>
            </div>
        </div>
    )
}

@page("/")
export class Welcome {

    render() {
        return <WelcomeComponent/>;
    }
}
