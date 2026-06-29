/* eslint-disable */
// @ts-nocheck
import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport }     from './routes/index'
import { Route as UploadImport }    from './routes/upload'
import { Route as RecordsImport }   from './routes/records'
import { Route as IssuesImport }    from './routes/issues'
import { Route as FixesImport }     from './routes/fixes'
import { Route as AuditImport }     from './routes/audit'
import { Route as TeamImport }      from './routes/team'
import { Route as AnalyticsImport } from './routes/analytics'
import { Route as SettingsImport }  from './routes/settings'
import { Route as LandingImport }   from './routes/landing'
import { Route as PricingImport }   from './routes/pricing'
import { Route as LoginImport }     from './routes/login'
import { Route as SignupImport }    from './routes/signup'
import { Route as AboutImport }     from './routes/about'
import { Route as BlogImport }      from './routes/blog'
import { Route as DocsImport }      from './routes/docs'
import { Route as ContactImport }   from './routes/contact'

const IndexRoute     = IndexImport.update({     id:'/',          path:'/',          getParentRoute:()=>rootRoute } as any)
const UploadRoute    = UploadImport.update({    id:'/upload',    path:'/upload',    getParentRoute:()=>rootRoute } as any)
const RecordsRoute   = RecordsImport.update({   id:'/records',   path:'/records',   getParentRoute:()=>rootRoute } as any)
const IssuesRoute    = IssuesImport.update({    id:'/issues',    path:'/issues',    getParentRoute:()=>rootRoute } as any)
const FixesRoute     = FixesImport.update({     id:'/fixes',     path:'/fixes',     getParentRoute:()=>rootRoute } as any)
const AuditRoute     = AuditImport.update({     id:'/audit',     path:'/audit',     getParentRoute:()=>rootRoute } as any)
const TeamRoute      = TeamImport.update({      id:'/team',      path:'/team',      getParentRoute:()=>rootRoute } as any)
const AnalyticsRoute = AnalyticsImport.update({ id:'/analytics', path:'/analytics', getParentRoute:()=>rootRoute } as any)
const SettingsRoute  = SettingsImport.update({  id:'/settings',  path:'/settings',  getParentRoute:()=>rootRoute } as any)
const LandingRoute   = LandingImport.update({   id:'/landing',   path:'/landing',   getParentRoute:()=>rootRoute } as any)
const PricingRoute   = PricingImport.update({   id:'/pricing',   path:'/pricing',   getParentRoute:()=>rootRoute } as any)
const LoginRoute     = LoginImport.update({     id:'/login',     path:'/login',     getParentRoute:()=>rootRoute } as any)
const SignupRoute     = SignupImport.update({    id:'/signup',    path:'/signup',    getParentRoute:()=>rootRoute } as any)
const AboutRoute     = AboutImport.update({     id:'/about',     path:'/about',     getParentRoute:()=>rootRoute } as any)
const BlogRoute      = BlogImport.update({      id:'/blog',      path:'/blog',      getParentRoute:()=>rootRoute } as any)
const DocsRoute      = DocsImport.update({      id:'/docs',      path:'/docs',      getParentRoute:()=>rootRoute } as any)
const ContactRoute   = ContactImport.update({   id:'/contact',   path:'/contact',   getParentRoute:()=>rootRoute } as any)

export interface FileRoutesByPath {
  '/':         { id:'/';          preLoaderRoute:typeof IndexImport;     fullPath:'/'          }
  '/upload':   { id:'/upload';    preLoaderRoute:typeof UploadImport;    fullPath:'/upload'    }
  '/records':  { id:'/records';   preLoaderRoute:typeof RecordsImport;   fullPath:'/records'   }
  '/issues':   { id:'/issues';    preLoaderRoute:typeof IssuesImport;    fullPath:'/issues'    }
  '/fixes':    { id:'/fixes';     preLoaderRoute:typeof FixesImport;     fullPath:'/fixes'     }
  '/audit':    { id:'/audit';     preLoaderRoute:typeof AuditImport;     fullPath:'/audit'     }
  '/team':     { id:'/team';      preLoaderRoute:typeof TeamImport;      fullPath:'/team'      }
  '/analytics':{ id:'/analytics'; preLoaderRoute:typeof AnalyticsImport; fullPath:'/analytics' }
  '/settings': { id:'/settings';  preLoaderRoute:typeof SettingsImport;  fullPath:'/settings'  }
  '/landing':  { id:'/landing';   preLoaderRoute:typeof LandingImport;   fullPath:'/landing'   }
  '/pricing':  { id:'/pricing';   preLoaderRoute:typeof PricingImport;   fullPath:'/pricing'   }
  '/login':    { id:'/login';     preLoaderRoute:typeof LoginImport;     fullPath:'/login'     }
  '/signup':   { id:'/signup';    preLoaderRoute:typeof SignupImport;    fullPath:'/signup'    }
  '/about':    { id:'/about';     preLoaderRoute:typeof AboutImport;     fullPath:'/about'     }
  '/blog':     { id:'/blog';      preLoaderRoute:typeof BlogImport;      fullPath:'/blog'      }
  '/docs':     { id:'/docs';      preLoaderRoute:typeof DocsImport;      fullPath:'/docs'      }
  '/contact':  { id:'/contact';   preLoaderRoute:typeof ContactImport;   fullPath:'/contact'   }
}

const rootRouteChildren = {
  IndexRoute, UploadRoute, RecordsRoute, IssuesRoute, FixesRoute, AuditRoute,
  TeamRoute, AnalyticsRoute, SettingsRoute,
  LandingRoute, PricingRoute, LoginRoute, SignupRoute,
  AboutRoute, BlogRoute, DocsRoute, ContactRoute,
}

export const routeTree = rootRoute._addFileChildren(rootRouteChildren)._addRouteTypes()
