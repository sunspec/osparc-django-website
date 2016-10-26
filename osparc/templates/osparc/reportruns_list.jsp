<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<div id="refresh_overlay" style="display:none;"><div style="position:absolute;top:45%;left:47%;"><img src="/resources/images/ajax-loader.gif"/></div></div>
 <table id="ss_reportList" class="tablesorter">
    <thead>
    <tr>
      <th class="o_category_filter_header"><spring:message code="report.name"/></th>
      <th class="o_category_filter_header"><spring:message code="report.status"/></th>
      <th class="o_category_filter_header"><spring:message code="report.timeRequested"/></th>
      <th class="o_category_filter_header"><spring:message code="report.reportDefOptions"/></th>
    </tr>
  </thead>
  <tbody>
<c:forEach items="${reports}" var="report" varStatus="status">
        <c:choose>
          <c:when test="${report.reportDef.name!=''}"><c:set var="reportName" value="${report.reportDef.name}"/></c:when>
          <c:otherwise><c:set var="reportName" value="${report.reportDef.id}"/></c:otherwise>
        </c:choose>
    <tr id="reportDef_${report.id}">
      <td><c:if test="${report.recordStatus==1}"><a os-data-reportname='<c:out value="${reportName}"/>' os-data-reportrun-id="${report.id}" class="viewReportLink" href="javascript:void(0);"></c:if>
        <c:out value="${reportName}"/>
        <c:if test="${report.recordStatus==1}"></a></c:if>
      </td>
      <td><span id="reportStatus_${status.index}">
        <c:choose>
          <c:when test="${report.recordStatus==1}"><spring:message code="report.status.ready"/></c:when>
          <c:when test="${report.recordStatus==2}"><spring:message code="report.status.pending"/></c:when>
          <c:when test="${report.recordStatus==5}"><spring:message code="report.status.processing"/></c:when>
          <c:when test="${report.recordStatus==6}"><spring:message code="report.status.failed"/></c:when>
          <c:when test="${report.recordStatus==9}"><spring:message code="report.status.empty"/></c:when>
          <c:otherwise><spring:message code="report.status.unknown"/></c:otherwise>
        </c:choose>
      </span>
      </td>
      <td><fmt:formatDate type="both" timeStyle="full" value="${report.runTime}" /></td>
      <td><a href="/report/edit/${report.reportDef.id}"><spring:message code="report.edit"/></a> <c:if test="${report.reportDef.id!=1}"><a id="delete_${report.id}" os-data-reportdef-id="${report.id}" class="deleteReportLink" href="#"><spring:message code="report.delete"/></a></c:if> <c:if test="${report.recordStatus==1}"><a class="runReportLink" os-data-reportrun-index="${status.index}" os-data-runreport-id="${report.reportDef.id}" href="javascript:void(0);"><spring:message code="report.run"/></a>  <a class="downloadReportLink" os-data-report-id="${report.id}" href="/v1/reportrun/${report.id}/csv" download="${reportName}.csv"><spring:message code="report.download"/></a></c:if></td>
    </tr></c:forEach>
  </tbody>
    <!--tr><td colspan="7"><a href="javascript:alert('todo');"><spring:message code="report.reports.download"/></a></td></tr-->
  </table>
  <jsp:include page="../includes/report_popup.jsp" />
