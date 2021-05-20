// Database constants

import { Injectable } from '@angular/core';

import { URLSearchParams, Headers, RequestOptions,ResponseContentType } from '@angular/http';
import { Router } from '@angular/router';
import { BaseHttpService } from './base-http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { UserConfig } from './user.configs';

import { Views } from '../dbservices/views_permission_table';
import { Logs } from '../logging/logs';
import { MessageService, SUCCESS, FAILED } from './message.service';
import {SnotifyService,SnotifyConfig} from 'ng-snotify';

@Injectable()
export class DbService {

    /**Consiguration section
     * 
     * 
     * 
     * @memberOf DbService
     */

    url = 'http://ec2-54-89-59-195.compute-1.amazonaws.com';
    api = '/api/v2/';
    //login_key='60be98014bd2441c782dbbb2c0c2034c04fdd810e1b3e7c3d851f600d9710390';
    login_org_key = '60be98014bd2441c782dbbb2c0c2034c04fdd810e1b3e7c3d851f600d9710390';//school_org app key
    login_org_db = "school_org";

    folders = "users";

    // NOTE
    // this will be replaced in upcoming development
    // hardcoded only for development puporse 



    //dev_db="smsdev";
    //dev_db_mongo="msdb";
    //dev_key="ee5a4eda9368db6b30998a02d159a2ccb2328fee5e8cc973a346182a152a1a27";

    // making single url

    // base_service_url=this.url+this.api+this.dev_db+'/_table/';
    // base_service_func=this.url+this.api+this.dev_db+'/_func/';
    // base_service_mongo_url = this.url+this.api+this.dev_db_mongo+'/_table/';
    // queryHeaders:any ;


    /**
     * DB related functions
     * 
     * @memberOf DbService
     */

    // setup on instatnce creation

     public isOnline: boolean = navigator.onLine;

    constructor(private httpService: BaseHttpService, private userconf: UserConfig, private log: Logs, private message: MessageService,
    private notify:SnotifyService) {
        //  this.queryHeaders = new Headers();
        //  this.queryHeaders.append('Content-Type', 'application/json');
        //  this.queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        //  this.queryHeaders.append('X-Dreamfactory-API-Key', this.dev_key);
         window.addEventListener('online', () => {this.isOnline = true});
         window.addEventListener('offline', () => {this.isOnline = false});
    }

    // ===============================================================================================

    // select query with filters , where and order commands
    /**
     * 
     * 
     * @param {BaseHttpService} httpService 
     * @param {*} tableName 
     * @param {*} appendUrl 
     * @param {URLSearchParams} [params] 
     * @returns {Observable <any>} 
     * 
     * @memberOf DbService
     */
    query(tableName: any, appendUrl: any, params?: URLSearchParams): Observable<any> {

        if(this.isOnline){
        let queryUrl = this.getBaseServiceUrl() + tableName + appendUrl;
        this.log.consoleLog("Invoking query " + queryUrl);


        return this.httpService.http
            .get(queryUrl, { search: params, headers: this.getQueryHeader(this.userconf.getSchoolKey()) })
            .map((response) => {
                //response.json();
                //  this.log.consoleLog(response.json());               
                return response;
            }).catch((error: any) => {
                {
                    this.handleError(error);
                    return Observable.throw(new Error(error.status));
                }
            });
        }
        else
        {
           this.userconf.cleanUp();
        }

    }

    /**
     * handling system errors
     * 
     * @private
     * @param {*} error 
     * @returns 
     * 
     * @memberOf DbService
     */

    private handleError(error: any) {
        // let errMsg = (error.message) ? error.message :
        // error.status ? `${error.status} - ${error.statusText}` : 'Server error';
       
        localStorage.setItem('session_token', '');

        if(error.status === 401)
         {
            window.location.hash = '/login';
            this.log.consoleLog(error.statusText); // log to console instead
         }

        
        return Observable.throw(error);
    };

    // ===============================================================================================

    /**
     * Update / Insert table data
     * 
     * @param {BaseHttpService} httpService 
     * @param {*} tableName 
     * @param {*} appendUrl 
     * @param {URLSearchParams} [params] 
     * @returns {Observable <any>} 
     * 
     * @memberOf DbService
     */

    update(tableName: any, data: any, where: any): Observable<any> {

        let updateUrl = this.getBaseServiceUrl() + tableName;

       // this.log.consoleLog("Invoking Update on " + tableName + " Url" + updateUrl + '/' + data.id);

        let options = new RequestOptions({ headers: this.getQueryHeader(this.userconf.getSchoolKey()) });
        if (where === '' || where === null || where === undefined) {
            this.log.consoleLog("Bulk Data update " + this.toJsonBulkDataToDb(data));
            //let ids = data.id;
            //let filter = new URLSearchParams();
            //filter.set('ids', ids);
            //delete data.id;
           // this.log.consoleLog("final data" + this.toJsonBulkDataToDb(data));
            return this.httpService.http.patch(updateUrl, this.toJsonBulkDataToDb(data), options)
                .map((response) => {
                    this.log.consoleLog("Updated Resonse " + response.json());
                    return response.json();

                }).catch((error: any) => { { this.handleError(error); return Observable.throw(new Error(error.status)); } });

        }
        else if (where != '' && where != null) {
            //updateUrl=updateUrl+'?filter='+JSON.stringify(where);
            this.log.consoleLog("Final Url " + updateUrl);

            return this.httpService.http.patch(updateUrl, this.toJsonDb(data), { search: where, headers: this.getQueryHeader(this.userconf.getSchoolKey()) })
                .map((response) => {
                    this.log.consoleLog("Updated Resonse " + response.json());
                    return response.json();

                }).catch((error: any) => { { this.handleError(error); return Observable.throw(new Error(error.status)); } });

        }
    }



    insert(tableName: any, data: any): Observable<any> {

        let insertUrl = this.getBaseServiceUrl() + tableName;

        this.log.consoleLog("URl " + insertUrl);

        let options = new RequestOptions({ headers: this.getQueryHeader(this.userconf.getSchoolKey()) });
        this.log.consoleLog("Invoking insert on " + tableName + " Data" + this.toJsonDb(data));

        return this.httpService.http.post(insertUrl, this.toJsonDb(data), options)
            .map((response) => {
                this.log.consoleLog("Insert Resonse " + response.json());
                return response.json();
            }).catch((error: any) => { { this.handleError(error); return Observable.throw(new Error(error.status)); } });

    }

 
    /**
     * Delete the record from database
     * 
     * 
     * @param {*} tableName 
     * @param {string} id 
     * @returns 
     * 
     * @memberOf DbService
     */

    delete(tableName: any,data:any, where: string): Observable<any> {

        let deleteUrl = this.getBaseServiceUrl() + tableName ; // delete record with id or any unique value
        let options = new RequestOptions({ headers: this.getQueryHeader(this.userconf.getSchoolKey()) });

        this.log.consoleLog("Invoking Delete  " + deleteUrl);

        
          if (where === '' || where === null || where === undefined) {
                  this.log.consoleLog("Bulk Data Delete " + this.toJsonBulkDataToDb(data)); 
                options.body = this.toJsonBulkDataToDb(data);
                   return this.httpService.http .delete(deleteUrl, options)
            .map((response) => {
                var result: any = response.json();
                this.log.consoleLog("Deleted " + result);
                return result;
            }).catch((error: any) => { { this.handleError(error); return Observable.throw(new Error(error.status)); } });
          }
          else{

                 this.log.consoleLog("Final Url " + deleteUrl);

            return this.httpService.http.delete(deleteUrl,{ search: where, headers: this.getQueryHeader(this.userconf.getSchoolKey()) })
                .map((response) => {
                    this.log.consoleLog("Updated Resonse " + response.json());
                    return response.json();

                }).catch((error: any) => { { this.handleError(error); return Observable.throw(new Error(error.status)); } });
          }
       
    }

 


    // ===============================================================================================
    /**
     * Register user with below data example
     * 
        toJson (stringify?: boolean):any {
            var doc = {
                email:"dev@aikshika.com",
                first_name: "Development",
                last_name: "User",
                display_name:"Developer",          
                password: "dev@123",
                code:"work"		
            };
    
             this.log.consoleLog(" Sending " + JSON.stringify(doc));
            return stringify ? JSON.stringify(doc) : doc;
        }
    
     * @param {*} jsonData 
     * 
     * @memberOf DbService
     */

    register(jsonData: any): Observable<any> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: this.getQueryHeader(this.login_org_key) });

        return this.httpService.http
            .post(this.url + this.api + 'user/register', jsonData, options)
            .map((response) => {
                this.log.consoleLog("DuringReg");
                this.log.consoleLog(response);
                return response;
            }, (error) => {
                this.log.consoleLog("Error message");
                let response: {
                    ststus: 400,
                    statusText: 'Failed'
                }
                return response;
                // this.handleError(error);
            });



    }

    /**
     * 
     * 
     * @param {*} doc 
     * 
     * Example:
     * 	var doc = {
                id: this.id, // value
                name: this.name // value
            };
    
     * @returns {*} 
     * 
     * @memberOf DbService
     */
    toJsonDb(doc: any): any {

        if(doc instanceof Array) {
              return JSON.stringify({ resource: doc });
        }
        return JSON.stringify({ resource: [doc] });
    }


     toJsonBulkDataToDb(doc: any): any {
        return JSON.stringify({ resource: doc });
    }


    // Forgot Password.......................
    forgotPassword(jsonData: any) {

        this.log.consoleLog(jsonData);
        return this.httpService.http
            .post(this.url + this.api + 'user/password?reset=true', jsonData)
            .map((response) => {
                //this.log.consoleLog("DuringReg");
                this.log.consoleLog(response);
                return response;
            }, (error) => {
                this.log.consoleLog("Error message");
                let response: {
                    ststus: 400,
                    statusText: 'Failed'
                }
                return response;
                // this.handleError(error);
            });
    }


    // Reset Password.........................
    resetPassword(jsonData: any): Observable<any> {


        return this.httpService.http
            .post(this.url + this.api + 'user/password', jsonData)
            .map((response) => {
                // this.log.consoleLog("DuringReg");
                this.log.consoleLog(response);
                return response;
            }, (error) => {
                this.log.consoleLog("Error message");
                let response: {
                    ststus: 400,
                    statusText: 'Failed'
                }
                return response;
                // this.handleError(error);
            });



    }

    // =========================================================================================



    login(FormValue: any, route: Router, path: any) {

        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: queryHeaders });

        if(!this.isOnline) {

             this.notify.warning("No Network","Device is not connected to internet");
        }

        this.httpService.http.post(this.url + this.api + 'user/session', JSON.stringify(FormValue), options)
            .subscribe((data) => {
                this.message.sendMessage(SUCCESS);
                this.log.consoleLog("login success" + data.json());
                this.storeInfo(data.json(), route, path);

            }, (error) => {
                this.message.sendMessage(FAILED);
                this.log.consoleLog("Error login " + error);
            });

    }

    // After success route to home 

    private storeInfo(data, route: Router, path: any) {
        this.userconf.setSession(data.session_token);
        //Enable the below line once  routes setup done

        this.querySchoolInfo().subscribe((data) => {


            this.log.consoleLog(data.resource[0]);
            this.userconf.setSchoolKey(data.resource[0].schools_by_school_code.api_key);
            this.userconf.setSchoolId(data.resource[0].schools_by_school_code.school_id);
            this.userconf.setSchoolCode(data.resource[0].schools_by_school_code.school_code);
            this.userconf.setMsDbName(data.resource[0].schools_by_school_code.db);
            this.userconf.setMongoName(data.resource[0].schools_by_school_code.mongo);
            this.userconf.setFiles(data.resource[0].schools_by_school_code.storage);
            this.userconf.setSchoolName(data.resource[0].schools_by_school_code.school_name);
            this.userconf.setUserEmail(data.resource[0].user_email);
            this.userconf.setBasePath(data.resource[0].schools_by_school_code.base_path);
                    
            let queryFilter = new URLSearchParams();
            queryFilter.set('fields', 'intRegistrationId,documentId,group_name');
            queryFilter.set('filter', 'loginid like %' + this.userconf.getUserEmail() + '%');
            this.query('mst_registration', '', queryFilter).subscribe((result) => {

                let data = result.json();
                this.log.consoleLog(data);
                data.resource.forEach(element => {
                    this.userconf.setRegId(element.intRegistrationId);
                    this.userconf.setGroupName(element.group_name);
                });

                this.getViewPermissions(route);
            });


        });


        //get User information 





    }


    //==============================================================================================


    /**
     * Logout the application
     * close all the session
     * clean up
     * 
     * @memberOf DbService
     */
    logout(route: Router){


        let options = new RequestOptions({ headers: this.getQueryHeader(this.userconf.getSchoolKey()) });
      this.httpService.http.delete(this.url + this.api+'user/session', options)
            .subscribe((data) => {
                this.log.consoleLog("logout success" + data.json());
                this.userconf.cleanUp();
                this.log.consoleLog('session token' + localStorage.getItem('session_token'));
                route.navigate(['login']);
                //return true;
            }, (error) => {
                this.log.consoleLog("Error logout " + error);
                //return false;
            });


    }


    //==============================================================================================



    //==============================================================================================

    /**
     * MongoDb database rest api
     * 
     * With belo functionality
     * 
     * 1. select with filters
     * 2. Insert 
     * 3. Update with filters
     * 4. Delete with filter
     * 
     * 
     * Naming Convension as follows 
     * 
     * xxxMongo(....)
     *
     */


    // =======================================================================================



    // select query with filters , where and order commands
    /**
     * 
     * 
     * @param {BaseHttpService} httpService 
     * @param {*} tableName 
     * @param {*} appendUrl 
     * @param {URLSearchParams} [params] 
     * @returns {Observable <any>} 
     * 
     * @memberOf DbService
     */
    queryMongo(tableName: any, appendUrl: any, params?: URLSearchParams): Observable<any> {

        let queryUrl = this.getBaseServiceMongo() + tableName + appendUrl;
        this.log.consoleLog("Invoking query " + queryUrl);


        return this.httpService.http
            .get(queryUrl, { search: params, headers: this.getQueryHeader(this.userconf.getSchoolKey()) })
            .map((response) => {
                //response.json();
                //         this.log.consoleLog(response.json());

                return response;
            }).catch((error: any) => { { this.handleError(error); return Observable.throw(new Error(error.status)); } });


    }

    // ===============================================================================================

    /**
     * Update / Insert table data
     * 
     * @param {BaseHttpService} httpService 
     * @param {*} tableName 
     * @param {*} appendUrl 
     * @param {URLSearchParams} [params] 
     * @returns {Observable <any>} 
     * 
     * @memberOf DbService
     */

    updateMongo(tableName: any, data: any, where: any): Observable<any> {

        let updateUrl = this.getBaseServiceMongo() + tableName;
        //this.log.consoleLog("Invoking Update on " + tableName + " Url" + updateUrl + '/' + data.id);

        let options = new RequestOptions({ headers: this.getQueryHeader(this.userconf.getSchoolKey()) });
        // if (data.id) {
        //     this.log.consoleLog("Where id " + data.id + " Data" + this.toJsonDb(data));
        //     let ids = data.id;
        //     let filter = new URLSearchParams();
        //     filter.set('ids', ids);
        //     delete data.id;
        //     this.log.consoleLog("final data" + this.toJsonDb(data));
        //     return this.httpService.http.patch(updateUrl, this.toJsonDb(data), { search: filter, headers: this.getQueryHeader(this.userconf.getSchoolKey()) })
        //         .map((response) => {
        //             this.log.consoleLog("Updated Resonse " + response.json());
        //             return response.json();

        //         }).catch((error: any) => { { this.handleError(error); return Observable.throw(new Error(error.status)); } });

        // }
        if (where === '' || where === null || where === undefined) {
            this.log.consoleLog("Bulk Data update " + this.toJsonBulkDataToDb(data));

            return this.httpService.http.patch(updateUrl, this.toJsonBulkDataToDb(data), options)
                .map((response) => {
                    this.log.consoleLog("Updated Resonse " + response.json());
                    return response.json();

                }).catch((error: any) => { { this.handleError(error); return Observable.throw(new Error(error.status)); } });

        }
        else if (where != '' && where != null) {
            //updateUrl=updateUrl+'?filter='+JSON.stringify(where);
            this.log.consoleLog("Final Url " + updateUrl);

            return this.httpService.http.patch(updateUrl, this.toJsonDb(data), { search: where, headers: this.getQueryHeader(this.userconf.getSchoolKey()) })
                .map((response) => {
                    this.log.consoleLog("Updated Resonse " + response.json());
                    return response.json();

                }).catch((error: any) => { { this.handleError(error); return Observable.throw(new Error(error.status)); } });

        }
    }



    insertMongo(tableName: any, data: any): Observable<any> {

        let insertUrl = this.getBaseServiceMongo() + tableName;

        this.log.consoleLog("URl " + insertUrl);

        let options = new RequestOptions({ headers: this.getQueryHeader(this.userconf.getSchoolKey()) });
        this.log.consoleLog("Invoking insert on " + tableName + " Data" + this.toJsonDb(data));

        return this.httpService.http.post(insertUrl, this.toJsonDb(data), options)
            .map((response) => {
                this.log.consoleLog("Insert Resonse " + response.json());
                return response.json();
            }).catch((error: any) => { { this.handleError(error); return Observable.throw(new Error(error.status)); } });

    }

    /**
     * Delete the record from database
     * 
     * 
     * @param {*} tableName 
     * @param {string} id 
     * @returns 
     * 
     * @memberOf DbService
     */

    deleteMongo(tableName: any, where: URLSearchParams): Observable<any> {


        let deleteUrl = this.getBaseServiceMongo() + tableName; // delete record with id or any unique value

        this.log.consoleLog("Invoking Delete  " + deleteUrl);

        return this.httpService.http
            .delete(deleteUrl, { search: where, headers: this.getQueryHeader(this.userconf.getSchoolKey()) })
            .map((response) => {
                var result: any = response.json();
                this.log.consoleLog("Deleted " + result);
                return result;
            }).catch((error: any) => { { this.handleError(error); return Observable.throw(new Error(error.status)); } });
    }


    // ===============================================================================================


    // function to getDate and time from server.
    // this function are used to avoid user date time manupulation. 

    /**
     * getDate or getTime need to passed as functionName
     * @param functionName 
     */
    getDateTime(functionName: string): Observable<any> {

        this.log.consoleLog("Invoking " + functionName + "  " + this.userconf.getSchoolKey());

        return this.httpService.http
            .get(this.getServiceFuncUrl() + functionName, { headers: this.getQueryHeader(this.userconf.getSchoolKey()) })
            .map((response) => {
                var result: any = response.text();
                this.log.consoleLog(result);
                return result;
            }).catch((error: any) => { { this.handleError(error); return Observable.throw(new Error(error.status)); } });
    }


    getBaseServiceUrl(): any {

        return this.url + this.api + this.userconf.getMsDbName() + '/_table/';
    }


    getServiceFuncUrl(): any {

        return this.url + this.api + this.userconf.getMsDbName() + '/_func/';
    }

    getBaseServiceMongo(): any {

        return this.url + this.api + this.userconf.getMongoName() + '/_table/';
    }

    getSchoolOrgUrl(): any {

        return this.url + this.api + this.login_org_db + '/_table/user_school'; // get school information

    }

    getServiceProcUrl(): any {

        return this.url + this.api + this.userconf.getMsDbName() + '/_proc/';
    }

    /**
     * 
     * After storing the session call this function
     */



    querySchoolInfo(): any {
        var URL = this.getSchoolOrgUrl() + '?related=schools_by_school_code';
        return this.httpService.http
            .get(URL, { headers: this.getQueryHeader(this.login_org_key) })
            .map((response) => {
                //   response.json();
                //           this.log.consoleLog(response.json());

                return response.json();
            }).catch((error: any) => { { this.handleError(error); return Observable.throw(new Error(error.status)); } });


    }


    /**
     * pass the application access key to build query heders
     * @param key 
     */

    getQueryHeader(key: any): Headers {
        let queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        queryHeaders.append('X-Dreamfactory-Session-Token', this.userconf.getSession());
        queryHeaders.append('X-Dreamfactory-API-Key', String(key.trim()));

        return queryHeaders;
    }





    getViewPermissions(route: Router) {
        var views = [];
        var menus = [];
        let queryFilter = new URLSearchParams();
        this.log.consoleLog("Group " + this.userconf.getGroupName());
        queryFilter.set('filter', 'group_name =' + this.userconf.getGroupName());
        this.queryMongo('group_view_access', '', queryFilter).subscribe((result) => {

            this.log.consoleLog(result.json());

            var data = result.json();
            data.resource.forEach((entry) => {
                views.push(Views.fromJson(entry))
            });


            this.userconf.setAccess(views);

          

            // navigate to default route configured 

            this.query('cfg_group_default_views', '', queryFilter).subscribe((result) => {
                var data = result.json();
                this.log.consoleLog(data);
                data.resource.forEach((entry) => {
                    this.userconf.setDefaultView(entry.view_name);
                });

               
            });

        // get Menus for user group 
           queryFilter.set('filter', 'group =' + this.userconf.getGroupName());
            this.queryMongo('appmenu', '', queryFilter).subscribe((result) => {

            this.log.consoleLog(result.json());

            var data = result.json();
            data.resource.forEach((entry) => {
               this.userconf.setMenus(entry.PAGE_MENU);
                 });

               this.log.consoleLog("Redirecting " + this.userconf.getDefaultView());
                route.navigate([this.userconf.getDefaultView()]);
            });
            

        });

    }



    /**
     * Call the mysql proceedures and return data
     */

    toProcParams(values: any): any {
            
        if(values instanceof Array) {
              return JSON.stringify({ params: values });
        }
        return JSON.stringify({ params: [values] });

    }

    getDataFromProc(procedureName: any, param: any): Observable<any> {
        let url = this.getServiceProcUrl() + procedureName;
        let queryFilter = new URLSearchParams();
        queryFilter.set('wrapper', 'resource');
        let options = new RequestOptions({ search: queryFilter, headers: this.getQueryHeader(this.userconf.getSchoolKey()) });


        if (param != null) {
            this.log.consoleLog(param);
            return this.httpService.http
                .post(url, this.toProcParams(param), options)
                .map((response) => {
           
                    this.log.consoleLog(response);

                    var result: any = response.json();

                    this.log.consoleLog(result);

                    return result;
                }).catch((error: any) => { { this.handleError(error); return Observable.throw(new Error(error.status)); } });

        }
        else {
            this.log.consoleLog(param);
            return this.httpService.http
                .get(url, options)
                .map((response) => {
                    var result: any = response.json();
                    this.log.consoleLog(result);
                    return result;
                }).catch((error: any) => { { this.handleError(error); return Observable.throw(new Error(error.status)); } });
        }
    }


    insertUserToSchool(doc: any): any {

        return this.httpService.http
            .post(this.getSchoolOrgUrl(), this.toJsonDb(doc), { headers: this.getQueryHeader(this.login_org_key) })
            .map((response) => {
                //   response.json();
                //           this.log.consoleLog(response.json());

                return response.json();
            }).catch((error: any) => { { this.handleError(error); return Observable.throw(new Error(error.status)); } });


    }






    /**
 * Uploading file to s3
 * 
 * 
 */

    s3Url = this.url + this.api + this.userconf.getFiles();
   

    uploadFile(fileObject:any,path:String): Observable<any> {
     
     // parh='/aikshika/dev/users/'
  
  
        let options = new RequestOptions({ headers: this.getFileUploadHeader(this.userconf.getSchoolKey()) });
        let url = this.s3Url +"/aikshika/dev001/users/1/"
       this.log.consoleLog("Invoking file upload " + url );

        return this.httpService.http.post(url,JSON.stringify(fileObject), options)
            .map((response) => {
              this.log.consoleLog("Upload Response " + response.json());
                return response.json();
            }) .catch((error: any) => { { this.handleError(error); return Observable.throw(new Error(error.status)); } });

    }





    getFileUploadHeader(key: any): Headers {
        let queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'multipart/form-data');

        queryHeaders.append('X-Dreamfactory-Session-Token', this.userconf.getSession());
        queryHeaders.append('X-Dreamfactory-API-Key', String(key.trim()));

        return queryHeaders;
    }




    /**
     * Amazon s3 files storage upload and download sections
     * 
     * 1. Download files of a single person.
     * 2. Download any person files based user rights.
     * 3. to download other person files pass rigistration id of a person.
     * 4. register id will act as folder in s3
     *  
     */


    getStorageUrl(): any {

        return this.url + this.api + this.userconf.getFiles()+"/"+this.userconf.getBasePath()+ "/" + this.userconf.getSchoolCode();
    }
    /**
     * 
     * @param readOnly load only file EX profile pic
     * @param onlylist read folder content and not download
     * @param download download a single file with file name @required(fileName)
     * @param fileName single file download @required(download=true)
     */
    downloadMyFile(readOnly: boolean, onlylist: boolean, download: boolean, fileName: String,path:String): Observable<any> {

        let url = this.getStorageUrl() +"/"+this.folders + "/" + this.userconf.getRegId();
        let options = new RequestOptions({ headers: this.getFileUploadHeader(this.userconf.getSchoolKey()) });

        if (onlylist && !download) {
            if (!readOnly){
                if(path!=null){
                url = url+"/"+path;
                }
                url = url + "/?include_files=true";
            }
            else {
                url = url + "/" + fileName;
                options = new RequestOptions({ headers: this.getFileUploadHeader(this.userconf.getSchoolKey()), responseType: ResponseContentType.Blob });
            }
        } else if (download) {

            if (fileName != '' && fileName != null) {
                url = url + "/" + fileName + "?download=true";
                options = new RequestOptions({ headers: this.getFileUploadHeader(this.userconf.getSchoolKey()), responseType: ResponseContentType.Blob });
            }

            else {
                let header = this.getFileUploadHeader(this.userconf.getSchoolKey());
                header.append('Content-Type', 'application/zip');
                header.append('Accept', 'application/zip');
                options = new RequestOptions({ headers: header, responseType: ResponseContentType.ArrayBuffer });
                //include_properties=false&include_folders=true&include_files=true&full_tree=false&
                url = url + "/?zip=true";
            }

        }



        this.log.consoleLog("Invoking file download " + url);

        return this.httpService.http.get(url, options)
            .map((response) => {
                // console.log("Upload Response "+ response.json());
                return response;
            }).catch((error: any) => { { this.handleError(error); return Observable.throw(new Error(error.status)); } });

    }


    /**
     * 
     * @param readOnly pass true to get list of files in folder
     * @param onlylist pass this to get list 
     * @param download pass true to download the file
     * @param fileName file you want to download    
     * @param path     path of the file dynamic     
     */

    searchAndDownloadFiles(readOnly: boolean, onlylist: boolean, download: boolean, fileName: String,path:String): Observable<any> {
        return;
    }


    deleteFile(fileObject: any): Observable<any> {
       this.log.consoleLog(fileObject);
        //let url = this.getStorageUrl() + "/" + fileObject.path;
        let url = this.s3Url +"/"+fileObject.path;
        let options = new RequestOptions({ headers: this.getFileUploadHeader(this.userconf.getSchoolKey()) });
        return this.httpService.http.delete(url, options)
            .map((response) => {
                // console.log("Upload Response "+ response.json());
                return response;
            }).catch((error: any) => { { this.handleError(error); return Observable.throw(new Error(error.status)); } });


    }


}