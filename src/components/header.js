/** @jsx jsx */
import { jsx } from 'theme-ui'

const Header = ({children}) => (
  <header
    className="site-header"
    sx={{
      bg: 'primary'
    }}
  >
  <style>
  @import url('https://fonts.googleapis.com/css2?family=Josefin+Slab:wght@100;300;400;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');
  </style>
  <div className="container grids col-3">
    {children}
  </div>
  </header>
)

export default Header
