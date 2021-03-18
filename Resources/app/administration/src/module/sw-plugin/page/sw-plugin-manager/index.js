import template from './sw-plugin-manager.html.twig';
import './sw-plugin-manager.scss';

/**
 * @feature-deprecated (flag:FEATURE_NEXT_12608) tag:v6.4.0
 * Deprecation notice: The whole plugin manager will be removed with 6.4.0 and replaced
 * by the extension module.
 * When removing the feature flag for FEATURE_NEXT_12608, also merge the merge request
 * for NEXT-13821 which removes the plugin manager.
 */

const { Component, Mixin, State } = Shopware;

Component.register('sw-plugin-manager', {
    template,

    mixins: [
        Mixin.getByName('notification')
    ],

    data() {
        return {
            searchTerm: '',
            isLoading: false,
            unsubscribeStore: null
        };
    },

    computed: {
        availableUpdates() {
            return State.get('swPlugin').availableUpdates;
        },

        storeAvailable() {
            return State.get('swPlugin').storeAvailable;
        }
    },

    metaInfo() {
        return {
            title: this.$createTitle()
        };
    },

    created() {
        this.createdComponent();
        this.unsubscribeStore = State.subscribe(this.showErrorNotification);
    },

    beforeDestroy() {
        this.unsubscribeStore();
    },

    methods: {
        onSearch(searchTerm) {
            this.searchTerm = searchTerm;
        },

        createdComponent() {
            this.isLoading = true;

            return State.dispatch('swPlugin/pingStore').then(() => {
                return State.dispatch('swPlugin/fetchAvailableUpdates');
            }).catch((e) => {
                throw e;
            }).finally(() => {
                this.isLoading = false;
            });
        },

        reloadPluginListing() {
            this.$router.push({ name: 'sw.plugin.index.list' });
        },

        showErrorNotification({ type, payload }) {
            if (type !== 'swPlugin/pluginErrorsMapped') {
                return;
            }

            payload.forEach((error) => {
                if (error.parameters) {
                    this.showApiNotification(error);
                    return;
                }
                this.createNotificationError({
                    message: this.$tc(error.message)
                });
            });
        },

        showApiNotification(error) {
            const docLink = this.$tc('sw-plugin.errors.messageToTheShopwareDocumentation', 0, error.parameters);
            this.createNotificationError({
                title: error.title,
                message: `${error.message} ${docLink}`,
                autoClose: false
            });
        }
    }
});
