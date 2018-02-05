# Wizzy

A simple wrap up of [Wizzy](https://github.com/utkarshcmu/wizzy) pinned at version 0.5.9. When started this container this container will post all datasources and dashboards found in the relevant directories to a configurable Grafana instance.

The following environment variables must be set:

```
GRAFANA_URL
GRAFANA_USERNAME
GRAFANA_PASSWORD
```

Mount json data into `/datasources` and `/dashboards` in order to have these automatically provisioned into Grafana.
