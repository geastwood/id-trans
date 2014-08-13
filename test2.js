Ext.define("IA.pixelcarrier.view.grid.Log", {
    extend: 'IA.pixelcarrier.view.grid.Base',
    tr: {},
    initComponent: function(args) {
        var me = this;

        me.callParent(args);

        /* jshint expr: true */
        me.loadData && me.loadData();
    },

    getColumns: function() {
        var me = this;
        return {
            items: [{
                header: me.tr.logUser,
                dataIndex: 'userId',
                renderer: function(value, meta, record) { // concat use data to `firstName lastName (userId)`
                    return Ext.String.format(me.tr.logUserFormatted, record.get('firstName'), record.get('lastName'), value);
                }
            }, {
                header: me.tr.logLastChange,
                dataIndex: 'lastChange'
            }, {
                header: me.tr.logChanges,
                dataIndex: 'changes',

                // concat all the changes and attach the tooltip
                renderer: function(value, meta) {
                    var data = Ext.JSON.decode(value), msgStr;

                    if (data && data.length) {
                        msgStr = Ext.Array.map(data, function(item) {
                            return Ext.String.format(me.tr.logChangesFormated, item.column, item.oldValue, item.newValue);
                        }).join('<br/>');
                    } else {
                        msgStr = me.tr.logChangesNoChangeMsg;
                    }

                    // add the tooltip and strip out `null`
                    meta.tdAttr = Ext.String.format(me.tr.logChangeTooltipStr, msgStr.replace(/[\u0000]/g, ''));

                    return msgStr;
                }
            }, {
                header: me.tr.logStatus,
                dataIndex: 'status'
            }],
            defaults: {
                flex: 1
            }
        };
    }
});
