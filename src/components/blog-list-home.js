/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Link} from "gatsby"
import { RiArrowDownLine, RiArrowRightSLine } from "react-icons/ri"

import PostCard from "./post-card"

export default function BlogListHome(props) {
  const data = props.data
  const posts = data.edges
    .filter(edge => !!edge.node.frontmatter.date)
    .map(edge =>
      <PostCard key={edge.node.id} data={edge.node} />)
    return <PostMaker data={posts} />
}

const PostMaker = ({ data }) => (
  <section className="home-posts">
    <h2>Recent Events</h2>
    <div className="grids col-1 sm-1 lg-2">
      {data}
    </div>
    <Link
      className="button"
      to="/blog"
      sx={{
        variant: 'links.button'
      }}
    >
      See more<span className="icon -right"><RiArrowRightSLine/></span>
    </Link>
  </section>
)
