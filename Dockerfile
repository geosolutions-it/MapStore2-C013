FROM geosolutionsit/mapstore2:latest
MAINTAINER geosolutions<info@geo-solutions.it>

# externalize geostore configuration
ENV JAVA_OPTS="${JAVA_OPTS} -Dgeostore-ovr=file://${CATALINA_BASE}/conf/geostore-datasource-ovr.properties"

RUN rm -rf ${CATALINA_BASE}/webapps

ADD mapstore.war "${CATALINA_BASE}/webapps/mapstore.war"
