"use strict";

var errorStrings = require('./../lib/error');

module.exports = AttachmentClient;

/**
 * Used to access Jira REST endpoints in '/rest/api/2/atachment'
 *
 * @constructor AttachmentClient
 * @param {JiraClient} jiraClient
 */
function AttachmentClient(jiraClient) {
    this.jiraClient = jiraClient;

    /**
     * Returns the meta-data for an attachment, including the URI of the actual attached file.
     *
     * @method getAttachment
     * @memberOf AttachmentClient#
     * @param opts The options for the API request.
     * @param opts.attachmentId The ID of the attachment to retrieve
     * @param callback
     */
    this.getAttachment = function (opts, callback) {
        if (!opts.attachmentId) {
            throw new Error(errorStrings.NO_ATTACHMENT_ID_ERROR);
        }

        var options = {
            uri: this.jiraClient.buildURL('/attachment/' + opts.attachmentId),
            method: 'GET',
            json: true,
            followAllRedirects: true
        };

        this.makeRequest(options, callback);
    };

    /**
     * Helper method to reduce duplicated code.  Uses the JiraClient to make a request, calling back with either
     * the response, or the supplied error string if it exists.
     *
     * @method makeRequest
     * @memberOf IssueClient#
     * @param {Object} options The requiest options; probably built with {@link IssueClient#buildRequestOptions}
     * @param {Function} callback Called with the Jira APIs response.
     * @param {string} [successString] If supplied, this is reported instead of the response body.
     */
    this.makeRequest = function (options, callback, successString) {
        this.jiraClient.makeRequest(options, function (err, response, body) {
            if (err || response.statusCode.toString()[0] != 2) {
                return callback(err ? err : body);
            }

            return callback(null, successString ? successString : body);
        });
    };
}