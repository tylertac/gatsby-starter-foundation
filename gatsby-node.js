const path = require("path")
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  const blogList = path.resolve(`./src/templates/blog-list.js`)

  const result = await graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
      ) {
        edges {
          node {
            id
            frontmatter {
              slug
              template
              title
            }
          }
        }
      }
    }
  `)

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  // Create markdown pages
  const posts = result.data.allMarkdownRemark.edges
  let blogPostsCount = 0

  posts.forEach((post, index) => {
    const id = post.node.id
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    createPage({
      path: post.node.frontmatter.slug,
      component: path.resolve(
        `src/templates/${String(post.node.frontmatter.template)}.js`
      ),
      // additional data can be passed via context
      context: {
        id,
        previous,
        next,
      },
    })

    // Count blog posts.
    if (post.node.frontmatter.template === 'blog-post') {
      blogPostsCount++
    }
  })

  // Create blog-list pages
  const postsPerPage = 9
  const numPages = Math.ceil(blogPostsCount / postsPerPage)

  Array.from({ length: numPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/blog` : `/blog/${i + 1}`,
      component: blogList,
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        numPages,
        currentPage: i + 1,
      },
    })
  })

}

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` })
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createFieldExtension, createTypes } = actions

  createFieldExtension({
    name: 'fileByDataPath',
    extend: () => ({
      resolve: function (src, args, context, info) {
        const partialPath = src.featureImage
          if (!partialPath) {
            return null
          }

        const filePath = path.join(__dirname, 'src/data', partialPath)
        const fileNode = context.nodeModel.runQuery({
          firstOnly: true,
          type: 'File',
          query: {
            filter: {
              absolutePath: {
                eq: filePath
              }
            }
          }
        })

        if (!fileNode) {
          return null
        }

        return fileNode
      }
    })
  })

  const typeDefs = `
    type Frontmatter @infer {
      featureImage: File @fileByDataPath
    }

    type MarkdownRemark implements Node @infer {
      frontmatter: Frontmatter
    }
  `

  createTypes(typeDefs)
}
