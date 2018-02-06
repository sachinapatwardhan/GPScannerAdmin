(function() {
    'use strict';

    /**
     * Main module of the Fuse
     */
    angular
        .module('fuse', [

            // Core
            'app.core',

            // Navigation
            'app.navigation',

            // Toolbar
            'app.toolbar',

            // Quick panel
            'app.quick-panel',

            // Sample
            // 'app.sample',
            'app.Dashboard',
            'app.login',

            'app.City',
            'app.Module',
            'app.Setting',
            'app.roles',
            'app.UserPermission',
            'app.ChangePassword',
            'app.Register',
            'app.Forgotpassword',
            // 'app.SendEmail',
            'app.DeviceStatus',
            'app.Customer',
            'app.Vehicle',
            'app.user',
            'app.Trackers',
            'app.gps',
            'app.alarm',
            'app.CanBusData',
            'app.DrivingBehaviour',
            'app.telco',
            'app.appinfo',
            'app.HandShake',
            'app.SIM',
            'app.Utility',
            'app.TransferDevice',
            'app.VehicleType',
            'app.ModuleMgmt',
            'app.MainSetting',
            'app.EmailTemplate',
            'app.Language',
            // 'app.LanguageResource',
            'app.MobileLanguageResource',
            'app.VehicleLastUse',
            'app.ServiceType',
            'app.AssignDevice',
            'app.attribute',
            'app.product',
            'app.orderservice',
            'app.WalletTransaction',
            'app.wallet',
            'app.VehicleMonitor',
            'app.AuditLog',
            'app.ManageCustomer',
            'app.GPSDeleteData',
            'app.userfeedback',
            'app.SharedVehicle'
        ]);
})();