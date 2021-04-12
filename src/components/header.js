/** @jsx jsx */
import { jsx } from 'theme-ui'

const Header = ({children}) => (
  <header
    className="site-header"
    sx={{
      bg: 'primary'
    }}
  >
  <div className="container grids col-3">
    {children}
  </div>
  </header>
)

export default Header
