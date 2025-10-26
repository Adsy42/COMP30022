# Legal AI Query & Referral System - Deployment Strategy & CD Plan

**Document Version**: 1.0
**Last Updated**: October 2025
**Team**: COMP30022 IT Project
**Status**: Approved

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Deployment Architecture](#deployment-architecture)
3. [Platform Selection & Rationale](#platform-selection--rationale)
4. [Continuous Deployment Strategy](#continuous-deployment-strategy)
5. [Trade-offs & Benefits Analysis](#trade-offs--benefits-analysis)
6. [Risk Assessment & Mitigation](#risk-assessment--mitigation)
7. [Cost Analysis](#cost-analysis)
8. [Alternative Solutions Considered](#alternative-solutions-considered)
9. [Implementation Timeline](#implementation-timeline)
10. [Success Metrics](#success-metrics)

---

## Executive Summary

### Overview

The Legal AI Query & Referral System will be deployed using a **microservices architecture** across multiple cloud platforms, leveraging modern PaaS (Platform as a Service) solutions to minimize operational overhead while maximizing reliability and scalability.

### Key Decisions

| Component | Platform | Justification |
|-----------|----------|---------------|
| **Frontend** | Vercel | Zero-config Next.js deployment, global CDN, automatic HTTPS |
| **Backend API** | Railway | Docker support, easy Python deployment, affordable pricing |
| **AI Service** | Railway | GPU-ready infrastructure, scalable compute resources |
| **Database** | MongoDB Atlas | Managed NoSQL, free tier for development, auto-scaling |
| **CI/CD** | GitHub Actions | Native GitHub integration, free for public repos, extensive ecosystem |

### Strategic Benefits

1. **Zero Infrastructure Management**: No server provisioning, patching, or maintenance
2. **Automatic Scaling**: Services scale based on demand without manual intervention
3. **Cost-Effective**: ~$40-60/month for production (vs $200-500/month for traditional VPS)
4. **Developer Experience**: Deploy in minutes, not days
5. **High Availability**: Built-in redundancy and failover across all platforms

---

## Deployment Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    INTERNET / END USERS                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTPS
                       │
         ┌─────────────▼──────────────┐
         │   VERCEL EDGE NETWORK      │
         │   (Global CDN)             │
         │                            │
         │  ┌──────────────────────┐  │
         │  │  Next.js Frontend    │  │
         │  │  - React Components  │  │
         │  │  - Static Assets     │  │
         │  │  - Server Components │  │
         │  └──────────────────────┘  │
         └─────────┬──────────────────┘
                   │
                   │ REST API (HTTPS)
                   │
         ┌─────────▼──────────────────┐
         │   RAILWAY PROJECT          │
         │                            │
         │  ┌──────────────────────┐  │
         │  │  Backend Service     │  │
         │  │  - Flask REST API    │  │
         │  │  - Gunicorn (4 wkrs) │  │
         │  │  - Business Logic    │◄─┼──┐
         │  └──────────┬───────────┘  │  │
         │             │               │  │
         │             │ HTTP          │  │
         │             │               │  │
         │  ┌──────────▼───────────┐  │  │
         │  │  AI Service          │  │  │
         │  │  - FastAPI           │  │  │
         │  │  - OpenAI Integration│  │  │
         │  │  - RAG Pipeline      │  │  │
         │  │  - Vector DB         │  │  │
         │  └──────────────────────┘  │  │
         └─────────────────────────────┘  │
                   │                      │
                   │ MongoDB Protocol     │
                   │                      │
         ┌─────────▼──────────────────┐  │
         │   MONGODB ATLAS            │  │
         │                            │  │
         │  ┌──────────────────────┐  │  │
         │  │  Database Cluster    │  │  │
         │  │  - queries           │  │  │
         │  │  - form_templates    │  │  │
         │  │  - analytics         │  │  │
         │  │  - users             │  │  │
         │  └──────────────────────┘  │  │
         │                            │  │
         │  ┌──────────────────────┐  │  │
         │  │  Automated Backups   │  │  │
         │  │  (Point-in-time)     │  │  │
         │  └──────────────────────┘  │  │
         └────────────────────────────┘  │
                                         │
         ┌───────────────────────────────┘
         │
         │  EXTERNAL INTEGRATIONS (Future)
         │
         │  ┌──────────────────────┐
         └─►│  ServiceNow API      │
            │  (Case Escalation)   │
            └──────────────────────┘
```

### Data Flow

1. **User Request**: Browser → Vercel CDN → Next.js Frontend
2. **API Call**: Frontend → Railway Backend → Business Logic
3. **AI Processing**: Backend → Railway AI Service → OpenAI API
4. **Data Persistence**: Backend → MongoDB Atlas → Storage
5. **Response**: Data flows back through the chain to user

### Deployment Regions

| Service | Primary Region | Reasoning |
|---------|---------------|-----------|
| Vercel Frontend | Global CDN | Low latency for all users |
| Railway Services | Sydney (syd1) | Close to University of Melbourne |
| MongoDB Atlas | Sydney (ap-southeast-2) | Data sovereignty, low latency |

---

## Platform Selection & Rationale

### 1. Frontend: Vercel

**Why Vercel?**

Vercel is built specifically for Next.js applications (created by the same company) and provides the best developer experience for our frontend stack.

**Key Features:**
- **Zero Configuration**: Automatic detection of Next.js framework
- **Global CDN**: 300+ edge locations worldwide for fast content delivery
- **Automatic HTTPS**: SSL certificates provisioned and renewed automatically
- **Preview Deployments**: Every PR gets a unique preview URL for testing
- **Edge Functions**: Run serverless functions at the edge for optimal performance
- **Built-in Analytics**: Performance monitoring and Web Vitals tracking

**Technical Benefits:**
- Optimized for React Server Components (Next.js 14+)
- Automatic code splitting and lazy loading
- Image optimization with next/image
- Instant cache invalidation on deployment
- DDoS protection included

**Why Not Alternatives?**
- **Netlify**: Similar but less optimized for Next.js specifically
- **AWS Amplify**: More complex setup, steeper learning curve
- **Self-hosted**: Requires nginx/load balancer configuration, SSL management

### 2. Backend & AI Service: Railway

**Why Railway?**

Railway provides the best balance of simplicity, power, and cost for our Python microservices.

**Key Features:**
- **Docker-First**: Native support for our Dockerfile-based deployments
- **Automatic Deployments**: Git push triggers instant deployment
- **Private Networking**: Services communicate over private network (security)
- **Resource Scaling**: Easy vertical scaling (CPU/RAM)
- **Persistent Volumes**: File storage for AI models/vector databases
- **Environment Variables**: Secure secret management
- **Health Checks**: Automatic service monitoring and restart

**Technical Benefits:**
- Python 3.11+ support out of the box
- Gunicorn/Uvicorn workers for production
- Built-in metrics and logging
- Zero-downtime deployments with health checks
- Support for GPU instances (future AI model hosting)

**Why Not Alternatives?**
- **Heroku**: More expensive ($25-50/dyno vs Railway $5/service), being phased out
- **AWS ECS/Fargate**: Complex setup, requires VPC/networking knowledge
- **Google Cloud Run**: Good option but less intuitive UX
- **DigitalOcean App Platform**: Limited Python/Docker support compared to Railway

### 3. Database: MongoDB Atlas

**Why MongoDB Atlas?**

Our application requires flexible schema for dynamic forms and query data, making NoSQL ideal.

**Key Features:**
- **Managed Service**: No database administration required
- **Free Tier**: M0 cluster (512MB) perfect for development
- **Auto-Scaling**: Grows with your data automatically
- **Automated Backups**: Point-in-time recovery included
- **Global Clusters**: Can distribute data geographically
- **Built-in Security**: Encryption at rest and in transit
- **Performance Insights**: Query optimization recommendations

**Technical Benefits:**
- Perfect for JSON-like documents (queries, forms, analytics)
- Flexible schema supports evolving requirements
- Aggregation pipeline for complex analytics
- Change streams for real-time features
- Full-text search capabilities

**Why Not Alternatives?**
- **PostgreSQL (Supabase/Neon)**: Rigid schema, complex migrations for dynamic forms
- **AWS DynamoDB**: Pay-per-request model expensive at scale
- **Firebase Firestore**: Vendor lock-in, limited query capabilities
- **Self-hosted MongoDB**: Requires backup strategy, monitoring, security patches

### 4. CI/CD: GitHub Actions

**Why GitHub Actions?**

Native integration with our existing GitHub workflow and zero additional tooling required.

**Key Features:**
- **Native Integration**: Already in GitHub, no external service needed
- **Free Tier**: 2,000 minutes/month for private repos, unlimited for public
- **Parallel Jobs**: Deploy multiple services simultaneously
- **Matrix Builds**: Test across multiple versions/environments
- **Extensive Marketplace**: 13,000+ pre-built actions
- **Secrets Management**: Encrypted secrets storage
- **Environment Protection**: Approval gates for production deployments

**Technical Benefits:**
- YAML-based configuration (version controlled)
- Caching for faster builds (npm, pip)
- Status checks integrated with PRs
- Deployment logs directly in GitHub
- Can trigger on any GitHub event

**Why Not Alternatives?**
- **Jenkins**: Requires self-hosting, complex setup
- **CircleCI**: External service, limited free tier
- **GitLab CI**: Would require migrating repository
- **Travis CI**: Reduced free tier, less active development

---

## Continuous Deployment Strategy

### CD Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      DEVELOPER WORKFLOW                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ git push origin main
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                    GITHUB ACTIONS TRIGGER                    │
│                                                              │
│  Event: Push to 'main' branch                               │
│  Concurrency: Only one deployment at a time                 │
└───────────────────────────┬─────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
┌───────────────▼──────┐   ┌───────────▼──────────┐
│   CI VALIDATION      │   │   BUILD ARTIFACTS    │
│   (from ci.yml)      │   │                      │
│                      │   │  - Frontend build    │
│  ✓ Linting           │   │  - Backend tests     │
│  ✓ Type checking     │   │  - AI service tests  │
│  ✓ Unit tests        │   │  - Docker images     │
│  ✓ Build tests       │   │                      │
└───────────────┬──────┘   └───────────┬──────────┘
                │                      │
                └──────────┬───────────┘
                           │
                ┌──────────▼───────────┐
                │   CD PIPELINE START  │
                │   (cd.yml)           │
                └──────────┬───────────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
┌────────▼─────────┐ ┌─────▼──────────┐ ┌──▼───────────────┐
│  DEPLOY FRONTEND │ │ DEPLOY BACKEND │ │ DEPLOY AI SERVICE│
│                  │ │                │ │                  │
│  Platform: Vercel│ │ Platform:      │ │ Platform: Railway│
│                  │ │ Railway        │ │                  │
│  Steps:          │ │                │ │ Steps:           │
│  1. Pull env     │ │ Steps:         │ │  1. Link service │
│  2. Build        │ │  1. Link svc   │ │  2. Deploy       │
│  3. Deploy prod  │ │  2. Deploy     │ │  3. Health check │
│  4. Get URL      │ │  3. Health chk │ │  4. Get URL      │
└────────┬─────────┘ └─────┬──────────┘ └──┬───────────────┘
         │                 │                │
         │                 │                │
         └─────────────────┼────────────────┘
                           │
                ┌──────────▼───────────┐
                │   SMOKE TESTS        │
                │                      │
                │  ✓ Frontend alive    │
                │  ✓ Backend /health   │
                │  ✓ AI service /health│
                │  ✓ API connectivity  │
                └──────────┬───────────┘
                           │
                ┌──────────▼───────────┐
                │   NOTIFICATION       │
                │                      │
                │  GitHub Summary      │
                │  Deployment URLs     │
                │  Status: ✓ Success   │
                └──────────────────────┘
```

### Deployment Workflow

#### 1. Development → Staging

```bash
# Developer workflow
git checkout develop
git pull origin develop
git checkout -b feature/SPRNT2-123-new-feature

# Make changes, test locally
make dev-up
make test

# Commit with conventional commits
git commit -m "feat(SPRNT2-123): add new feature"

# Push and create PR
git push origin feature/SPRNT2-123-new-feature
# Create PR to develop branch
```

**What Happens:**
- Pre-commit hooks run (formatting, linting, tests)
- GitHub Actions CI pipeline runs on PR
- Code review by team members
- Merge to `develop` branch (staging environment)

#### 2. Staging → Production

```bash
# After testing in staging
git checkout main
git merge develop
git push origin main
```

**What Happens Automatically:**
1. **CI Pipeline** runs first (from ci.yml):
   - Frontend tests, lint, type-check, build
   - Backend tests, lint, format check
   - AI service tests, lint, format check

2. **CD Pipeline** runs after CI passes (from cd.yml):
   - Deploy frontend to Vercel production
   - Deploy backend to Railway production
   - Deploy AI service to Railway production
   - Run smoke tests
   - Send notification

**Total Time**: ~5-8 minutes from push to production

### Rollback Strategy

#### Automated Rollback Triggers

- Health check failure for >2 minutes
- Smoke tests fail post-deployment
- Error rate spike (>5% of requests)

#### Manual Rollback Procedure

**Vercel (Frontend):**
```bash
# Via Dashboard
Deployments → Previous Deployment → Promote to Production

# Via CLI
vercel rollback https://previous-deployment-url.vercel.app
```

**Railway (Backend/AI Service):**
```bash
# Via Dashboard
Deployments → Previous Deployment → Redeploy

# Via CLI
railway rollback
```

**Time to Rollback**: <2 minutes

### Environment Strategy

| Environment | Branch | Purpose | Deployment |
|-------------|--------|---------|------------|
| **Development** | `feature/*` | Local development | Docker Compose |
| **Staging** | `develop` | Integration testing | Vercel Preview + Railway |
| **Production** | `main` | Live users | Vercel Production + Railway |

---

## Trade-offs & Benefits Analysis

### Benefits

#### 1. **Developer Velocity**
- ✅ **10x faster deployment**: Minutes vs hours/days with traditional infrastructure
- ✅ **Zero infrastructure management**: No servers to provision, patch, or monitor
- ✅ **Instant previews**: Every PR gets a live preview environment
- ✅ **Automatic scaling**: Services scale without manual intervention

**Impact**: Team can focus on features, not DevOps

#### 2. **Cost Efficiency**
- ✅ **~$40-60/month total** vs $200-500/month for AWS EC2 equivalent
- ✅ **Pay-per-use model**: Only pay for what you use
- ✅ **No ops team needed**: Save $80-120k/year on DevOps salary
- ✅ **Free development tier**: MongoDB M0, Vercel hobby tier

**Impact**: 70-80% cost reduction vs traditional hosting

#### 3. **Reliability & Performance**
- ✅ **99.9% uptime SLA** from all platforms
- ✅ **Global CDN**: <50ms latency for frontend worldwide
- ✅ **Auto-healing**: Failed containers restart automatically
- ✅ **Zero-downtime deployments**: Rolling updates with health checks

**Impact**: Better user experience, fewer outages

#### 4. **Security**
- ✅ **Automatic HTTPS**: SSL certificates managed automatically
- ✅ **DDoS protection**: Built into Vercel CDN
- ✅ **Private networking**: Services communicate over private network
- ✅ **Encrypted secrets**: Environment variables encrypted at rest
- ✅ **Compliance**: SOC 2, ISO 27001 certified platforms

**Impact**: Enterprise-grade security without security team

#### 5. **Scalability**
- ✅ **Horizontal scaling**: Vercel auto-scales frontend globally
- ✅ **Vertical scaling**: Railway can upgrade to GPU instances for AI
- ✅ **Database scaling**: MongoDB Atlas auto-scales storage
- ✅ **Handle 10,000+ users**: Architecture supports university-wide deployment

**Impact**: Ready for growth without re-architecture

### Trade-offs

#### 1. **Platform Lock-in**

**Trade-off**: Migrating away from Vercel/Railway requires effort

**Mitigation**:
- ✓ Docker containers are portable (backend/AI service)
- ✓ Next.js can be self-hosted if needed
- ✓ MongoDB connection string can point to any MongoDB server
- ✓ Infrastructure-as-code approach (all configs in Git)

**Risk Level**: LOW - Migration path exists if needed

#### 2. **Less Control Over Infrastructure**

**Trade-off**: Can't access underlying servers or customize kernel

**Impact**:
- Limited control over caching strategies
- Can't install custom system packages
- Debugging limited to application logs

**Mitigation**:
- ✓ Platforms provide sufficient logging/monitoring
- ✓ Can run custom Docker images (Railway)
- ✓ Most use cases don't require kernel-level access

**Risk Level**: LOW - Acceptable for this project

#### 3. **Cold Start Latency**

**Trade-off**: Railway containers may sleep after inactivity (free tier)

**Impact**:
- First request after inactivity: 5-10 second delay
- Subsequent requests: Normal performance

**Mitigation**:
- ✓ Upgrade to Hobby plan ($5/month) = no cold starts
- ✓ Keep-alive ping can prevent sleeping
- ✓ Only affects low-traffic periods

**Risk Level**: LOW - Solved with minimal cost

#### 4. **Cost Scaling**

**Trade-off**: Costs increase with heavy usage

**Scenario Analysis**:
- 100 users/day: ~$40/month (current plan)
- 1,000 users/day: ~$100/month
- 10,000 users/day: ~$300/month

**Mitigation**:
- ✓ Still cheaper than self-hosted at scale
- ✓ Can optimize (caching, query optimization)
- ✓ University can negotiate enterprise pricing

**Risk Level**: MEDIUM - Monitor usage, optimize as needed

#### 5. **Third-Party Dependency**

**Trade-off**: Rely on external platforms staying in business

**Mitigation**:
- ✓ All platforms are well-funded, industry leaders
- ✓ Vercel (raised $150M), Railway (raised $20M+)
- ✓ MongoDB (NYSE: MDB, market cap $23B)
- ✓ Can migrate if platform shuts down (see lock-in mitigation)

**Risk Level**: VERY LOW - Platforms are stable

### Overall Assessment

| Aspect | Rating | Notes |
|--------|--------|-------|
| **Developer Experience** | ⭐⭐⭐⭐⭐ | Excellent - minimal configuration |
| **Cost Efficiency** | ⭐⭐⭐⭐⭐ | Excellent - 70-80% savings |
| **Reliability** | ⭐⭐⭐⭐⭐ | Excellent - 99.9% uptime |
| **Scalability** | ⭐⭐⭐⭐ | Very Good - supports growth |
| **Security** | ⭐⭐⭐⭐⭐ | Excellent - enterprise-grade |
| **Flexibility** | ⭐⭐⭐ | Good - some limitations |
| **Migration Risk** | ⭐⭐⭐⭐ | Low - viable exit strategy |

**Verdict**: Benefits significantly outweigh trade-offs for this project.

---

## Risk Assessment & Mitigation

### High-Priority Risks

#### Risk 1: Service Outage During Critical Period

**Probability**: Low (1-2 times/year per platform)
**Impact**: High (users cannot access system)

**Mitigation Strategy**:
1. **Multi-region deployment** (future): Deploy to multiple Railway regions
2. **Status monitoring**: Subscribe to platform status pages
3. **Degraded mode**: Frontend can show cached data during backend outage
4. **Communication plan**: Email/Slack notification to users if outage occurs

**Contingency**: System typically recovers within 15-30 minutes automatically

#### Risk 2: Unexpected Cost Spike

**Probability**: Medium (possible with viral adoption)
**Impact**: Medium (budget overrun)

**Mitigation Strategy**:
1. **Budget alerts**: Set up billing alerts at $50, $100, $150 thresholds
2. **Rate limiting**: Implement per-user request limits (100 requests/hour)
3. **Caching**: Aggressive caching of AI responses (80% cache hit rate target)
4. **Cost monitoring dashboard**: Real-time cost visibility

**Contingency**: Can pause AI service temporarily, show cached responses only

#### Risk 3: Data Loss

**Probability**: Very Low (MongoDB Atlas has 99.995% durability)
**Impact**: Very High (lose user queries, forms, analytics)

**Mitigation Strategy**:
1. **Automated backups**: MongoDB Atlas continuous backups (included)
2. **Point-in-time recovery**: Can restore to any point in last 7 days
3. **Test restores**: Monthly backup restoration tests
4. **Critical data exports**: Weekly JSON exports of form configurations

**Contingency**: Restore from backup (15-30 minute recovery time)

### Medium-Priority Risks

#### Risk 4: Breaking Deployment

**Probability**: Medium (human error in code)
**Impact**: Medium (users see errors temporarily)

**Mitigation Strategy**:
1. **Staging environment**: Test in staging before production
2. **Automated tests**: CI pipeline catches 80% of issues
3. **Smoke tests**: Post-deployment verification
4. **Fast rollback**: <2 minute rollback capability
5. **Gradual rollout** (future): Deploy to 10% users first

**Contingency**: Immediate rollback to previous version

#### Risk 5: API Rate Limiting (OpenAI)

**Probability**: Medium (with high query volume)
**Impact**: Medium (AI responses fail temporarily)

**Mitigation Strategy**:
1. **Caching layer**: Cache identical queries (Redis future)
2. **Graceful degradation**: Show "AI busy, try again" message
3. **Request queuing**: Queue requests during rate limit
4. **Rate limit monitoring**: Alert at 80% of limit

**Contingency**: Fallback to pre-written responses for common questions

### Low-Priority Risks

#### Risk 6: Platform Policy Changes

**Probability**: Low
**Impact**: Low to Medium

**Mitigation**: Regular review of platform ToS, migration plan ready

#### Risk 7: Security Breach

**Probability**: Very Low (platforms are SOC 2 certified)
**Impact**: High

**Mitigation**:
- All secrets rotated every 90 days
- No sensitive data stored (university queries are not PII)
- Security headers configured
- Regular dependency updates

---

## Cost Analysis

### Monthly Cost Breakdown

#### Development Environment (Free)

| Service | Plan | Cost |
|---------|------|------|
| Vercel | Hobby | $0 |
| Railway | Free tier ($5 credit) | $0 |
| MongoDB Atlas | M0 Free | $0 |
| GitHub Actions | Free tier | $0 |
| **Total Development** | | **$0/month** |

#### Production Environment (Recommended)

| Service | Plan | Specifications | Cost |
|---------|------|----------------|------|
| **Vercel** | Pro | Unlimited bandwidth, analytics | $20/month |
| **Railway - Backend** | Hobby | 8GB RAM, 4 vCPU, 100GB traffic | $10/month |
| **Railway - AI Service** | Hobby | 8GB RAM, 4 vCPU, 100GB traffic | $15/month |
| **MongoDB Atlas** | M10 Shared | 10GB storage, auto-scaling | $57/month |
| **OpenAI API** | Pay-per-use | ~1000 queries/day | $5-20/month |
| **GitHub Actions** | Included | Private repo | $0 |
| **Total Production** | | | **$107-132/month** |

### Cost Comparison with Alternatives

#### Option A: Current PaaS Architecture (Recommended)
**Monthly**: $107-132
**Annual**: ~$1,400
**Staff Time**: Minimal (~2 hours/month monitoring)

#### Option B: AWS EC2 + RDS + CloudFront
**Monthly**: $180-250 (t3.medium instances)
**Annual**: ~$2,400
**Staff Time**: High (~20 hours/month for ops)
**Additional**: Need DevOps expertise

#### Option C: Self-Hosted on University Servers
**Monthly**: $0 (infrastructure)
**Annual**: $0 (infrastructure)
**Staff Time**: Very High (~40 hours/month)
**Additional**:
- Security patching
- Backup management
- Network configuration
- SSL certificate management
- On-call rotation needed

**Total Cost of Ownership (3 years)**:

| Option | Infrastructure | Staff Time (est.) | Total |
|--------|----------------|-------------------|-------|
| **PaaS (Recommended)** | $5,000 | $2,400 (72 hours) | **$7,400** |
| **AWS** | $8,600 | $24,000 (720 hours) | **$32,600** |
| **Self-Hosted** | $0 | $48,000 (1440 hours) | **$48,000** |

*Staff time calculated at $50/hour junior developer rate*

**Recommendation**: PaaS saves 77% vs AWS, 85% vs self-hosted over 3 years

### Cost Optimization Strategies

1. **Caching**: Reduce OpenAI API calls by 60-80%
2. **Resource right-sizing**: Start small, scale up only when needed
3. **Reserved capacity**: Can negotiate annual contracts for 20% discount
4. **Open-source models**: Future migration to self-hosted LLM (Llama 3, Mistral)

### Budget Forecast

**Year 1**: $1,500 (includes development + 6 months production)
**Year 2**: $1,800 (assumes 50% growth in usage)
**Year 3**: $2,500 (assumes university-wide rollout)

---

## Alternative Solutions Considered

### Alternative 1: Kubernetes (AWS EKS / GKE)

**Pros**:
- Maximum flexibility and control
- Can optimize costs at scale
- Industry-standard container orchestration

**Cons**:
- Steep learning curve (3-6 months to proficiency)
- Complex setup (networking, ingress, service mesh)
- Requires dedicated DevOps engineer
- Overkill for 3-service architecture
- Minimum cost ~$150-200/month just for cluster

**Decision**: ❌ Rejected - Too complex for project scope and timeline

### Alternative 2: Serverless (AWS Lambda + API Gateway)

**Pros**:
- Pay-per-request (potentially cheaper at low volume)
- Infinite scale
- No server management

**Cons**:
- Cold start latency (5-10 seconds)
- 15-minute timeout (problematic for AI processing)
- Complex architecture (API Gateway, Lambda, DynamoDB, S3)
- Vendor lock-in to AWS
- Difficult local development

**Decision**: ❌ Rejected - Cold starts unacceptable for user experience

### Alternative 3: Heroku (Traditional PaaS)

**Pros**:
- Simple git push deployment
- Mature platform (15+ years)
- Good documentation

**Cons**:
- Expensive ($25-50 per dyno)
- Being sunset by Salesforce (uncertain future)
- Less modern than Railway/Vercel
- Limited free tier removed

**Decision**: ❌ Rejected - Too expensive, uncertain future

### Alternative 4: DigitalOcean App Platform

**Pros**:
- Simple deployment
- Cheaper than Heroku ($5-10/month)
- Good documentation

**Cons**:
- Less mature than other platforms
- Limited global CDN (vs Vercel's 300+ locations)
- Smaller ecosystem and community
- Less optimized for Next.js

**Decision**: ❌ Rejected - Railway + Vercel combination is superior

### Alternative 5: Firebase (Google Cloud)

**Pros**:
- Fully managed (hosting, database, auth)
- Real-time database
- Good free tier

**Cons**:
- Vendor lock-in (very difficult to migrate)
- NoSQL only (Firestore) - limited query capabilities
- Not suitable for Flask/FastAPI backend
- Cloud Functions have cold start issues

**Decision**: ❌ Rejected - Too much vendor lock-in, doesn't fit our stack

### Why Current Solution Wins

| Criteria | Current (Railway+Vercel) | Kubernetes | Serverless | Heroku | Firebase |
|----------|--------------------------|------------|------------|--------|----------|
| **Ease of Setup** | ⭐⭐⭐⭐⭐ | ⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Cost** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| **Performance** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Scalability** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Flexibility** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Developer UX** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Future-Proof** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |

---

## Implementation Timeline

### Phase 1: Infrastructure Setup (Week 1)

**Tasks**:
- ✅ Create MongoDB Atlas cluster
- ✅ Set up Railway project
- ✅ Configure Vercel project
- ✅ Configure GitHub secrets
- ✅ Test manual deployments

**Deliverables**: All platforms configured and accessible

### Phase 2: CI/CD Pipeline (Week 2)

**Tasks**:
- ✅ Create GitHub Actions CI workflow
- ✅ Create GitHub Actions CD workflow
- ✅ Add automated tests to pipeline
- ✅ Configure environment protection rules
- ✅ Test end-to-end deployment

**Deliverables**: Fully automated deployment pipeline

### Phase 3: Documentation (Week 2-3)

**Tasks**:
- ✅ Write deployment quick start guide
- ✅ Write comprehensive deployment guide
- ✅ Document environment variables
- ✅ Create runbooks for common issues
- ✅ Document rollback procedures

**Deliverables**: Complete deployment documentation

### Phase 4: Production Deployment (Week 3)

**Tasks**:
- 🔄 Deploy to production (in progress)
- 🔄 Run smoke tests
- 🔄 Load testing
- 🔄 Security audit
- 🔄 Monitoring setup

**Deliverables**: Production-ready system

### Phase 5: Optimization (Week 4-ongoing)

**Tasks**:
- ⏳ Implement caching layer
- ⏳ Set up error tracking (Sentry)
- ⏳ Configure alerts and monitoring
- ⏳ Performance optimization
- ⏳ Cost optimization

**Deliverables**: Optimized, monitored production system

---

## Success Metrics

### Deployment Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| **Deployment Time** | <10 minutes | ~6 minutes | ✅ |
| **Deployment Success Rate** | >95% | TBD | 🔄 |
| **Rollback Time** | <5 minutes | ~2 minutes | ✅ |
| **Zero-Downtime Deployments** | 100% | TBD | 🔄 |

### Performance Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| **Frontend TTFB** | <200ms | TBD | 🔄 |
| **API Response Time (p95)** | <500ms | TBD | 🔄 |
| **AI Response Time (p95)** | <5s | TBD | 🔄 |
| **Uptime** | >99.5% | TBD | 🔄 |

### Cost Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| **Monthly Cost** | <$150 | $0 (dev) | ✅ |
| **Cost per User** | <$0.50 | TBD | 🔄 |
| **Cost per Query** | <$0.05 | TBD | 🔄 |

### Developer Experience Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| **Time to First Deployment** | <30 min | ~25 min | ✅ |
| **Developer Onboarding** | <1 hour | TBD | 🔄 |
| **PR Preview Environment** | 100% | 100% | ✅ |

---

## Conclusion

### Summary of Decisions

Our deployment strategy leverages modern PaaS platforms (Vercel, Railway, MongoDB Atlas) with automated CI/CD (GitHub Actions) to achieve:

1. **Minimal Operational Overhead**: Zero server management
2. **Maximum Developer Velocity**: Deploy in minutes, not days
3. **Cost Efficiency**: 70-80% savings vs traditional infrastructure
4. **Enterprise-Grade Reliability**: 99.9% uptime SLA
5. **Future-Proof Scalability**: Can grow from 100 to 10,000+ users

### Risk Assessment Summary

- **High-priority risks**: Mitigated with redundancy and monitoring
- **Cost risks**: Controlled with alerts and rate limiting
- **Security risks**: Addressed with platform security + best practices
- **Migration risks**: Docker containers provide portability

### Total Cost of Ownership

**3-Year TCO**: $7,400 (vs $32,600 AWS / $48,000 self-hosted)
**Savings**: 77-85% compared to alternatives

### Recommendation

**Approved for Implementation** ✅

The benefits significantly outweigh the trade-offs. This architecture provides the best balance of:
- Developer experience
- Cost efficiency
- Reliability
- Scalability
- Security

The team can focus on building features rather than managing infrastructure, allowing us to deliver value to University of Melbourne researchers faster.

---

## Appendices

### Appendix A: Deployment Checklist

- [x] MongoDB Atlas cluster created
- [x] Railway backend service configured
- [x] Railway AI service configured
- [x] Vercel project configured
- [x] GitHub secrets configured
- [x] CI pipeline tested
- [x] CD pipeline tested
- [ ] Production deployment verified
- [ ] Monitoring configured
- [ ] Alerting configured
- [ ] Documentation complete
- [ ] Team training complete

### Appendix B: Useful Links

- [Deployment Quick Start](./DEPLOYMENT-QUICKSTART.md)
- [Full Deployment Guide](./06-deployment-guide.md)
- [Environment Variables Reference](./07-environment-variables.md)
- [GitHub Repository](https://github.com/your-org/COMP30022)
- [Jira Board](https://itproject24.atlassian.net/)

### Appendix C: Contact Information

**For Deployment Issues**:
- DevOps Lead: Bryan (Scrum Master)
- Backend Support: Himank
- Frontend Support: Farah
- AI Service Support: Yusuf

**Escalation**: Adam (Product Owner)

---

**Document Status**: Ready for Confluence Publication
**Next Review**: After production deployment (Week 3)
**Version Control**: Stored in `/docs/CONFLUENCE-DEPLOYMENT-PLAN.md`
